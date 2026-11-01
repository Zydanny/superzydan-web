import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import YAML from "yaml";
import {
  cleanJournalText,
  isJournalMood,
  isJournalType,
  JOURNAL_MAX_LENGTH,
  JOURNAL_TIME_ZONE,
} from "@/lib/journal-shared";
import { absoluteUrl } from "@/lib/seo";

/*
 * Publishes a public journal entry from the phone composer (/journal/new).
 * The entry becomes content/journal/<id>.md, committed straight to GitHub;
 * the commit rebuilds the site like any other push, so the entry shows up on
 * /journal a few minutes later. Nothing is written to this server's disk:
 * Hostinger replaces it on every deploy.
 *
 * Set in hPanel (Environment variables), never in the repo:
 *   JOURNAL_PASSWORD      what I type on the composer. 12+ characters.
 *   JOURNAL_GITHUB_TOKEN  a fine-grained GitHub token for Zydanny/superzydan-web
 *                         only, with "Contents: Read and write".
 *   JOURNAL_BRANCH        optional, defaults to master. Set it to the test
 *                         branch on a test site so tries don't go live.
 */
export const dynamic = "force-dynamic";

const REPO = "Zydanny/superzydan-web";
const MAX_BODY_BYTES = 32_000;

/*
 * Guessing is slowed for everyone at once rather than locking anyone out: one
 * password check every 2 seconds across the whole site, and a wrong one waits a
 * second before answering. With a long random password that makes guessing
 * hopeless, and nobody can keep me from publishing by sending wrong ones.
 * (Addresses aren't used: X-Forwarded-For is whatever the sender writes.)
 */
const CHECK_GAP_MS = 2000;
const WRONG_DELAY_MS = 1000;
let lastCheck = 0;

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function passwordMatches(given: string, expected: string) {
  // Hash both so the comparison takes the same time whatever the lengths are.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/* Only the composer on this site may post here, not a page somewhere else. */
function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  const hosts = [request.headers.get("x-forwarded-host"), request.headers.get("host")]
    .map((value) => value?.split(",")[0].trim().toLowerCase())
    .filter(Boolean);
  return hosts.includes(originHost);
}

/* The entry's id and timestamp on my clock: 2026-11-01-120503 and 2026-11-01T12:05:03-06:00. */
function stamp(now: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: JOURNAL_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "longOffset",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  const offset = parts.timeZoneName === "GMT" ? "+00:00" : parts.timeZoneName.replace("GMT", "");
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  return {
    id: `${day}-${parts.hour}${parts.minute}${parts.second}`,
    date: `${day}T${parts.hour}:${parts.minute}:${parts.second}${offset}`,
  };
}

export async function POST(request: NextRequest) {
  const password = process.env.JOURNAL_PASSWORD ?? "";
  const token = process.env.JOURNAL_GITHUB_TOKEN ?? "";
  if (password.length < 12 || !token) {
    return json({ error: "Journal posting isn't set up on this site yet. Add the journal settings in hPanel." }, 503);
  }
  if (!sameOrigin(request)) {
    return json({ error: "Post entries from the journal page on this site." }, 403);
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ error: "That entry is too long." }, 413);
  }
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return json({ error: "That entry is too long." }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ error: "The entry didn't come through. Try again." }, 400);
  }

  const now = Date.now();
  if (now - lastCheck < CHECK_GAP_MS) {
    return json({ error: "Hang on a few seconds, then publish again." }, 429);
  }
  lastCheck = now;
  if (typeof body.password !== "string" || !passwordMatches(body.password, password)) {
    await new Promise((resolve) => setTimeout(resolve, WRONG_DELAY_MS));
    return json({ error: "Wrong password." }, 401);
  }

  const text = typeof body.text === "string" ? cleanJournalText(body.text) : "";
  if (!text) return json({ error: "Write something first." }, 400);
  if (text.length > JOURNAL_MAX_LENGTH) {
    return json({ error: `Keep it under ${JOURNAL_MAX_LENGTH} characters.` }, 400);
  }
  if (!isJournalType(body.type)) return json({ error: "Pick a type for the entry." }, 400);
  const mood = isJournalMood(body.mood) ? body.mood : undefined;

  const { id, date } = stamp(new Date(now));
  const frontmatter = YAML.stringify({ date, type: body.type, ...(mood ? { mood } : {}) });
  const file = `---\n${frontmatter}---\n\n${text}\n`;
  const branch = process.env.JOURNAL_BRANCH?.trim() || "master";

  let response: Response;
  try {
    response = await fetch(`https://api.github.com/repos/${REPO}/contents/content/journal/${id}.md`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "superzydanofficial-journal",
      },
      body: JSON.stringify({
        message: `Journal entry ${id}`,
        content: Buffer.from(file, "utf8").toString("base64"),
        branch,
      }),
      cache: "no-store",
    });
  } catch {
    return json({ error: "Couldn't reach GitHub. Check your connection and try again." }, 502);
  }

  if (!response.ok) {
    const reason =
      response.status === 401 || response.status === 403
        ? "GitHub turned the token down. It may have expired: make a new one and update JOURNAL_GITHUB_TOKEN in hPanel."
        : response.status === 404
          ? `GitHub couldn't find the ${branch} branch, or the token can't see the repo.`
          : response.status === 422
            ? "An entry with this exact time already exists. Wait a second and publish again."
            : "GitHub didn't save the entry. Try again in a minute.";
    return json({ error: reason }, 502);
  }

  return json({ id, url: absoluteUrl(`/journal#${id}`), branch });
}

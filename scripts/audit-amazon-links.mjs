/*
 * Checks every Amazon short link the site can show and records the ones that
 * land on a different tracking ID:
 *
 *   npm run links:audit
 *
 * Scans content/, lib/, components/ and app/, plus every reviews-channel video
 * description (the Quick Takes grid shows those links). Each amzn.to / geni.us
 * link is followed to Amazon. Links that land with our AMAZON_ASSOCIATE_TAG are
 * recorded as null; links with another tag are mapped to the product's own
 * amazon.com/dp page with our tag. lib/affiliate.ts applies the map when the
 * site renders. Links already in lib/amazon-link-fixes.json are skipped, so
 * reruns only check new ones. geni.us rate-limits, so this goes slowly.
 *
 * Needs YOUTUBE_API_KEY (environment or .env.local) for the channel part.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MAP_FILE = path.join(ROOT, "lib", "amazon-link-fixes.json");
const SHORT_LINK = /https?:\/\/(?:www\.)?(?:amzn\.to|geni\.us|urlgeni\.us|link\.amazon|a\.co)\/[^\s)\]"'<>*]+/g;

function siteSetting(name) {
  const site = readFileSync(path.join(ROOT, "lib", "site.ts"), "utf8");
  return new RegExp(`${name} = "([^"]+)"`).exec(site)?.[1] ?? null;
}

function apiKey() {
  if (process.env.YOUTUBE_API_KEY) return process.env.YOUTUBE_API_KEY;
  try {
    return /^YOUTUBE_API_KEY=(.+)$/m.exec(readFileSync(path.join(ROOT, ".env.local"), "utf8"))?.[1].trim() ?? null;
  } catch {
    return null;
  }
}

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return filesUnder(full);
    return /\.(mdx|ts|tsx)$/.test(name) ? [full] : [];
  });
}

async function channelDescriptions(key, channelId) {
  const playlistId = `UU${channelId.slice(2)}`;
  const ids = [];
  let pageToken = "";
  do {
    const page = await (
      await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${key}${pageToken ? `&pageToken=${pageToken}` : ""}`,
      )
    ).json();
    ids.push(...(page.items ?? []).map((item) => item.contentDetails.videoId));
    pageToken = page.nextPageToken ?? "";
  } while (pageToken);
  const descriptions = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = await (
      await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids.slice(i, i + 50).join(",")}&key=${key}`)
    ).json();
    descriptions.push(...(batch.items ?? []).map((video) => video.snippet.description ?? ""));
  }
  return descriptions;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function landing(url) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const response = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } });
      if (response.status !== 429) return response.url;
    } catch {
      // Network hiccup; retry.
    }
    await sleep(3000 * (attempt + 1));
  }
  return null;
}

async function main() {
  const tag = siteSetting("AMAZON_ASSOCIATE_TAG");
  if (!tag) throw new Error("AMAZON_ASSOCIATE_TAG isn't set in lib/site.ts");

  const texts = ["content", "lib", "components", "app"].flatMap((dir) =>
    filesUnder(path.join(ROOT, dir)).map((file) => readFileSync(file, "utf8")),
  );
  const key = apiKey();
  if (key) texts.push(...(await channelDescriptions(key, siteSetting("REVIEWS_YOUTUBE_CHANNEL_ID"))));
  else console.warn("No YOUTUBE_API_KEY: skipping the reviews channel descriptions");

  const map = JSON.parse(readFileSync(MAP_FILE, "utf8"));
  const links = [...new Set(texts.flatMap((text) => text.match(SHORT_LINK) ?? []))].filter((url) => !(url in map));
  console.log(`${links.length} new short link(s) to check`);

  const unresolved = [];
  for (const url of links) {
    await sleep(1500);
    const landed = await landing(url);
    if (!landed) {
      unresolved.push(url);
      continue;
    }
    const target = new URL(landed);
    const host = target.hostname.replace(/^www\./, "");
    if (host !== "amazon.com" && !host.endsWith(".amazon.com")) {
      map[url] = null;
      continue;
    }
    const asin = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/.exec(target.pathname)?.[1];
    if (target.searchParams.get("tag") === tag || !asin) {
      if (!asin && target.searchParams.get("tag") !== tag) unresolved.push(`${url} (no product page)`);
      map[url] = null;
      continue;
    }
    map[url] = `https://www.amazon.com/dp/${asin}?tag=${tag}`;
    console.log(`${url}: tag ${target.searchParams.get("tag")} -> ${map[url]}`);
  }

  const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MAP_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
  const fixes = Object.values(sorted).filter(Boolean).length;
  console.log(`${Object.keys(sorted).length} link(s) on record, ${fixes} mapped to our tag`);
  for (const url of unresolved) console.log(`  check by hand: ${url}`);
}

await main();

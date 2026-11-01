/*
 * Journal pieces that both the server and the phone composer need: the entry
 * types, moods, the time zone days are counted in, and X's character count.
 * No file system access here, so client components can import it.
 */

export const JOURNAL_TYPES = {
  thought: { label: "Thought", tone: "text-haze" },
  affirmation: { label: "Affirmation", tone: "text-neon-magenta" },
  grateful: { label: "Grateful", tone: "text-neon-cyan" },
  win: { label: "Win", tone: "text-paint-yellow" },
  moment: { label: "Moment", tone: "text-neon-violet" },
} as const;

export type JournalType = keyof typeof JOURNAL_TYPES;

export const JOURNAL_MOODS = ["Rough", "Meh", "Okay", "Good", "Great"] as const;
export type JournalMood = (typeof JOURNAL_MOODS)[number];

/* Days roll over at midnight where I live, not at midnight UTC. */
export const JOURNAL_TIME_ZONE = "America/Chicago";

/* A free X account gets 280 characters per post. */
export const X_LIMIT = 280;

export const JOURNAL_MAX_LENGTH = 5000;

export function isJournalType(value: unknown): value is JournalType {
  return typeof value === "string" && value in JOURNAL_TYPES;
}

export function isJournalMood(value: unknown): value is JournalMood {
  return typeof value === "string" && (JOURNAL_MOODS as readonly string[]).includes(value);
}

/*
 * Zero-width characters, non-breaking spaces, bidi controls and the BOM (the
 * same set scripts/check-invisible-chars.mjs rejects). Spaces become normal
 * spaces; everything else is dropped.
 */
const INVISIBLE_SPACES = /[\u00a0\u2000-\u200a\u202f\u205f\u3000]/g;
const INVISIBLE_OTHER = /[\u00ad\u180e\u200b-\u200f\u2028-\u202e\u2060-\u2064\u2066-\u206f\ufeff]/g;

export function cleanJournalText(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(INVISIBLE_SPACES, " ")
    .replace(INVISIBLE_OTHER, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/*
 * X's own counting: most Latin text counts 1 per character, emoji and most
 * other scripts count 2, and every link counts 23 however long it is.
 */
const URL_PATTERN = /https?:\/\/\S+/g;

function weight(codePoint: number) {
  return codePoint <= 4351 ||
    (codePoint >= 8192 && codePoint <= 8205) ||
    (codePoint >= 8208 && codePoint <= 8223) ||
    (codePoint >= 8242 && codePoint <= 8247)
    ? 1
    : 2;
}

export function xLength(text: string) {
  let total = 0;
  const withoutUrls = text.normalize("NFC").replace(URL_PATTERN, () => {
    total += 23;
    return "";
  });
  for (const char of withoutUrls) total += weight(char.codePointAt(0)!);
  return total;
}

/*
 * The first draft of an X post from an entry: the whole thing if it fits,
 * otherwise as many whole sentences from the start as fit, so the post ends on
 * a complete thought. Only when the first sentence alone is too long does it
 * fall back to whole words with "..." on the end.
 */
export function draftXPost(text: string) {
  const cleaned = cleanJournalText(text);
  const flat = cleaned.replace(/\s*\n+\s*/g, " ");
  if (xLength(flat) <= X_LIMIT) return flat;

  // A line break ends a sentence too, even without a full stop.
  const sentences = cleaned
    .split(/\n+/)
    .flatMap((line) => line.trim().split(/(?<=[.!?…]["')\]]?)\s+/))
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  let fitted = "";
  for (const sentence of sentences) {
    const next = fitted ? `${fitted} ${sentence}` : sentence;
    if (xLength(next) > X_LIMIT) break;
    fitted = next;
  }
  if (fitted) return fitted;

  const words = flat.split(" ");
  let draft = "";
  for (const word of words) {
    const next = draft ? `${draft} ${word}` : word;
    if (xLength(`${next}...`) > X_LIMIT) break;
    draft = next;
  }
  if (!draft) {
    // One giant word: cut it by whole characters so an emoji never splits.
    for (const char of flat) {
      if (xLength(`${draft}${char}...`) > X_LIMIT) break;
      draft += char;
    }
  }
  return `${draft.replace(/[\s,;:.-]+$/, "")}...`;
}

/* Opens X with the post filled in. Nothing is posted until I tap Post there. */
export function xIntentUrl(text: string) {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

/* YYYY-MM-DD for an instant, on my calendar. */
export function journalDayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: JOURNAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import YAML from "yaml";
import {
  cleanJournalText,
  isJournalMood,
  isJournalType,
  journalDayKey,
  type JournalMood,
  type JournalType,
} from "@/lib/journal-shared";

/*
 * Public journal entries live in content/journal/<id>.md, one file per entry:
 * YAML frontmatter (date, type, optional mood) and the entry as plain text.
 * The phone composer at /journal/new writes these files through GitHub, and
 * they can be edited or deleted from the GitHub website like blog posts.
 * Private entries never come here: the repo is public.
 */
const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");

export type JournalEntry = {
  /** The file name without .md, also the entry's anchor on /journal. */
  id: string;
  /** ISO 8601 with offset, e.g. 2026-11-01T12:05:00-06:00. */
  date: string;
  /** YYYY-MM-DD on my calendar. */
  day: string;
  type: JournalType;
  mood?: JournalMood;
  /** Plain text. Blank lines split paragraphs. */
  text: string;
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function parseEntry(file: string, raw: string): JournalEntry {
  const where = `content/journal/${file}`;
  const match = FRONTMATTER.exec(raw);
  if (!match) throw new Error(`${where}: missing --- frontmatter block`);
  const data = (YAML.parse(match[1]) ?? {}) as Record<string, unknown>;

  const rawDate = typeof data.date === "string" ? data.date.trim() : "";
  // A date without a time (typed by hand on GitHub) means that day, not UTC midnight the day before.
  const dateOnly = DATE_ONLY.test(rawDate);
  const when = new Date(dateOnly ? `${rawDate}T18:00:00Z` : rawDate);
  if (!rawDate || Number.isNaN(when.getTime())) {
    throw new Error(`${where}: date must look like 2026-11-01T12:05:00-06:00`);
  }
  if (!isJournalType(data.type)) {
    throw new Error(`${where}: type must be thought, affirmation, grateful, win or moment`);
  }
  const text = cleanJournalText(raw.slice(match[0].length));
  if (!text) throw new Error(`${where}: the entry is empty`);

  return {
    id: path.basename(file, ".md"),
    date: dateOnly ? when.toISOString() : rawDate,
    day: dateOnly ? rawDate : journalDayKey(when),
    type: data.type,
    ...(isJournalMood(data.mood) ? { mood: data.mood } : {}),
    text,
  };
}

/* Every entry, newest first. A missing folder just means no entries yet. */
export const getJournalEntries = cache(async (): Promise<JournalEntry[]> => {
  let files: string[];
  try {
    files = (await readdir(JOURNAL_DIR)).filter((file) => file.endsWith(".md"));
  } catch {
    return [];
  }
  const entries = await Promise.all(
    files.map(async (file) => {
      try {
        return parseEntry(file, await readFile(path.join(JOURNAL_DIR, file), "utf8"));
      } catch (error) {
        // One mistyped file edited on a phone shouldn't take the whole site down: skip it and say so in the build log.
        console.error(`Skipping journal entry: ${error instanceof Error ? error.message : error}`);
        return null;
      }
    }),
  );
  return entries
    .filter((entry): entry is JournalEntry => entry !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export function shiftDay(day: string, by: number) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + by);
  return date.toISOString().slice(0, 10);
}

/*
 * Days in a row with at least one entry, counting back from today. A streak
 * that ended yesterday still counts until today is over.
 */
export function journalStreak(entries: JournalEntry[], now = new Date()) {
  const days = new Set(entries.map((entry) => entry.day));
  let day = journalDayKey(now);
  if (!days.has(day)) day = shiftDay(day, -1);
  let streak = 0;
  while (days.has(day)) {
    streak += 1;
    day = shiftDay(day, -1);
  }
  return streak;
}

/* Whole days since a YYYY-MM-DD date, on my calendar. The start day itself is day 1. */
export function daysSince(start: string, now = new Date()) {
  const today = new Date(`${journalDayKey(now)}T12:00:00Z`).getTime();
  const from = new Date(`${start}T12:00:00Z`).getTime();
  return Math.floor((today - from) / 86_400_000) + 1;
}

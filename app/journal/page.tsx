import type { Metadata } from "next";
import { cn } from "cn";
import { PageHero } from "@/components/page-hero";
import { daysSince, getJournalEntries, journalStreak, shiftDay, type JournalEntry } from "@/lib/journal";
import { JOURNAL_TIME_ZONE, JOURNAL_TYPES, journalDayKey } from "@/lib/journal-shared";
import { PAGES, pageMetadata } from "@/lib/seo";
import { soberSince } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGES.journal);

/*
 * New entries arrive with a rebuild, but the streak and the sober count move
 * with the calendar, so the page also refreshes every hour.
 */
export const revalidate = 3600;

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: JOURNAL_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

const numberFormat = new Intl.NumberFormat("en-US");

function dayHeading(day: string, now: Date) {
  const today = journalDayKey(now);
  const yesterday = shiftDay(today, -1);
  if (day === today) return "Today";
  if (day === yesterday) return "Yesterday";
  const date = new Date(`${day}T12:00:00Z`);
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(day.slice(0, 4) === today.slice(0, 4) ? {} : { year: "numeric" }),
  });
}

function groupByDay(entries: JournalEntry[]) {
  const days = new Map<string, JournalEntry[]>();
  for (const entry of entries) {
    const list = days.get(entry.day) ?? [];
    list.push(entry);
    days.set(entry.day, list);
  }
  return [...days.entries()];
}

export default async function JournalPage() {
  const entries = await getJournalEntries();
  const now = new Date();
  const stats = [
    ...(soberSince ? [{ label: "Days sober", value: daysSince(soberSince, now) }] : []),
    { label: "Day streak", value: journalStreak(entries, now) },
    { label: "Entries", value: entries.length },
  ];

  return (
    <main id="content" className="flex-1">
      <PageHero
        title="Journal"
        tone="violet"
        description="Life outside the stream. Wins, rough days, what I'm grateful for and where my head's at, written as it happens."
        aside={<StatsPlate stats={stats} />}
      />

      <section aria-label="Entries" className="shell shell-y">
        {entries.length === 0 ? (
          <p className="max-w-2xl text-lg text-haze">The first entry is on its way. Check back soon.</p>
        ) : (
          <div className="grid max-w-2xl gap-14">
            {groupByDay(entries).map(([day, list], index) => (
              <section key={day} aria-labelledby={`day-${day}`} className={cn(index > 1 && "render-later")}>
                <h2 id={`day-${day}`} className="text-sm font-bold tracking-[0.14em] text-white uppercase">
                  <time dateTime={day}>{dayHeading(day, now)}</time>
                </h2>
                <ol className="mt-5 grid gap-5">
                  {list.map((entry) => (
                    <li key={entry.id}>
                      <EntryPlate entry={entry} />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatsPlate({ stats }: { stats: { label: string; value: number }[] }) {
  return (
    <div className="chamfer bg-neon-violet/45 p-[2px] [--cut:14px] lg:max-w-md lg:justify-self-end">
      <dl className="chamfer flex flex-wrap gap-x-10 gap-y-5 bg-night-raised px-6 py-5 [--cut:13px]">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse">
            <dt className="text-xs font-bold tracking-[0.14em] text-haze uppercase">{stat.label}</dt>
            <dd className="font-display text-4xl leading-none font-black text-white tabular-nums">
              {numberFormat.format(stat.value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function EntryPlate({ entry }: { entry: JournalEntry }) {
  const type = JOURNAL_TYPES[entry.type];
  const paragraphs = entry.text.split(/\n{2,}/);

  return (
    <article id={entry.id} className="chamfer scroll-mt-(--header-h) bg-neon-violet/40 p-[2px] [--cut:12px]">
      <div className="chamfer bg-night-raised p-5 [--cut:11px] sm:p-6">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold tracking-wide uppercase">
          <span className={type.tone}>{type.label}</span>
          <span aria-hidden className="text-neon-violet">/</span>
          <time dateTime={entry.date} className="text-haze">
            {timeFormat.format(new Date(entry.date))}
          </time>
          {entry.mood ? (
            <>
              <span aria-hidden className="text-neon-violet">/</span>
              <span className="text-haze">Feeling {entry.mood.toLowerCase()}</span>
            </>
          ) : null}
        </p>
        <div
          className={cn(
            "mt-3 grid gap-4 leading-relaxed text-pretty break-words whitespace-pre-line",
            entry.type === "affirmation" ? "text-xl font-semibold text-white" : "text-haze",
          )}
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "cn";
import type { Tone } from "@/components/sign-heading";

const TONE_TEXT: Record<Tone, string> = {
  magenta: "neon-magenta",
  cyan: "neon-cyan",
  violet: "neon-violet",
};

export type Crumb = { name: string; path: string };

/*
 * The top of every inner page: the page's name as a big lit sign over the same
 * wet-street floor line as the home hero, one plain line on what's here, and
 * whatever actions the page needs. The sign powers on once on load (opacity
 * only, never from invisible, so it still paints straight away).
 */
export function PageHero({
  title,
  description,
  tone = "cyan",
  crumbs,
  aside,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  /** Shown above the title; the last crumb is the current page. */
  crumbs?: Crumb[];
  /** A photo or panel beside the title on desktop, under it on phones. */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        className={cn(
          "shell relative grid gap-8 pt-8 pb-12 lg:pt-14 lg:pb-16",
          aside && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-14",
        )}
      >
        <div className="min-w-0">
          {crumbs ? <Breadcrumbs crumbs={crumbs} /> : null}
          <h1
            className={cn(
              "font-display animate-tube-on text-[3.25rem] leading-[0.86] font-black text-balance uppercase min-[400px]:text-6xl lg:text-8xl",
              TONE_TEXT[tone],
              crumbs && "mt-4",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-xl text-lg text-pretty text-haze lg:mt-6 lg:text-xl">{description}</p>
          ) : null}
          {children}
        </div>
        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>

      {/* The street line the page stands on, lit from both ends like the hero floor. */}
      <div
        aria-hidden
        className="shell relative h-px before:absolute before:inset-x-4 before:h-px before:bg-[linear-gradient(90deg,transparent,var(--neon-magenta)_20%,var(--neon-cyan)_80%,transparent)] before:opacity-50 lg:before:inset-x-8"
      />
    </section>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm font-semibold text-haze">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex min-w-0 items-center gap-1">
              {last ? (
                <span aria-current="page" className="line-clamp-1 text-white">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.path}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-neon-cyan"
                  >
                    {crumb.name}
                  </Link>
                  <ChevronRightIcon aria-hidden className="size-4 shrink-0 text-neon-violet" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

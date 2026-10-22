import type { CSSProperties, ReactNode } from "react";
import { cn } from "cn";

export type Tone = "magenta" | "cyan" | "violet";

const TONE_TEXT: Record<Tone, string> = {
  magenta: "neon-magenta",
  cyan: "neon-cyan",
  violet: "neon-violet",
};

/*
 * A section heading lit like the street signs: condensed caps with a static
 * glow. It switches on (a short flicker) the first time it reaches the screen
 * via data-neon. The line under it says what the section is in plain words;
 * there are no eyebrow labels above headings on this site.
 */
export function SignHeading({
  id,
  as: Tag = "h2",
  tone = "cyan",
  size = "lg",
  sub,
  className,
  children,
}: {
  id?: string;
  as?: "h1" | "h2" | "h3";
  tone?: Tone;
  size?: "lg" | "md";
  sub?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Tag
        id={id}
        data-neon
        className={cn(
          "font-display leading-[0.86] font-black text-balance uppercase",
          TONE_TEXT[tone],
          size === "lg" ? "text-[3.25rem] min-[400px]:text-6xl lg:text-8xl" : "text-4xl lg:text-6xl",
        )}
      >
        {children}
      </Tag>
      {sub ? <p className="mt-3 max-w-xl text-lg text-pretty text-haze lg:text-xl">{sub}</p> : null}
    </div>
  );
}

/*
 * The small framed tube sign used to label a row or a block (like the rails in
 * the Watch section). Same build as CO-OP and NIGHT in the hero.
 */
export function TubeSign({
  as: Tag = "h3",
  tone = "magenta",
  className,
  children,
}: {
  as?: "h2" | "h3" | "p" | "span";
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      data-neon
      style={{ "--tube": `var(--neon-${tone})` } as CSSProperties}
      className={cn(
        "font-display tube-frame inline-block rounded-md px-3 py-1 text-2xl leading-none font-black tracking-[0.08em] uppercase lg:text-3xl",
        TONE_TEXT[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

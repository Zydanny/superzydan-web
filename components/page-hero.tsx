import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="shell pt-12 pb-8 lg:pt-20 lg:pb-10">
      <span className="text-eyebrow inline-flex items-center gap-2 text-primary">
        <span className="size-1 rounded-full bg-primary shadow-[0_0_8px_var(--glow-emerald)]" />
        {eyebrow}
      </span>
      <h1 className="text-display mt-4 max-w-5xl text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300 lg:text-xl">
          {description}
        </p>
      ) : null}
      {children}
    </Reveal>
  );
}

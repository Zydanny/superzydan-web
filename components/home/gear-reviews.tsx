"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRightIcon,
  CpuIcon,
  HeadphonesIcon,
  KeyboardIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { gearCategories } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  keyboard: KeyboardIcon,
  headphones: HeadphonesIcon,
  cpu: CpuIcon,
  video: VideoIcon,
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function GearReviews() {
  const [activeId, setActiveId] = useState(gearCategories[0].id);
  const active =
    gearCategories.find((category) => category.id === activeId) ?? gearCategories[0];

  return (
    <Section id="gear">
      <SectionHeading
        eyebrow="Loadout"
        title="Gear & setup showcase"
        description="Pulled from the real desk — Keyboards, audio, the PC, and the stream kit. Tap through for the full Setup list and shop links."
      />

      {/* Category switcher: the active pill slides between tabs via layoutId. */}
      <div
        role="tablist"
        aria-label="Gear categories"
        className="glass mb-8 flex w-full gap-1 overflow-x-auto rounded-2xl p-1.5 md:inline-flex md:w-auto md:flex-wrap"
      >
        {gearCategories.map((category) => {
          const Icon = icons[category.icon] ?? CpuIcon;
          const isActive = category.id === active.id;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(category.id)}
              className={cn(
                "relative inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="gear-tab-pill"
                  className="absolute inset-0 -z-10 rounded-xl bg-primary shadow-[0_0_24px_-8px_var(--glow-emerald)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <Icon className="size-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {active.items.map((item) => {
            const internal = item.href.startsWith("/");
            const cta = (
              <span className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                {item.cta}
                <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            );

            return (
            <SpotlightCard
              key={item.title}
              className={cn(
                "flex flex-col overflow-hidden",
                item.image ? "p-0 md:col-span-2 md:flex-row" : "p-6",
              )}
            >
              {item.image ? (
                <div className="relative aspect-video w-full shrink-0 md:aspect-auto md:w-[44%]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 44vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className={cn("flex flex-1 flex-col", item.image && "p-6")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-display text-lg">{item.title}</h3>
                  <p className="text-eyebrow mt-1.5 text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    item.pending
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/15 text-primary",
                  )}
                >
                  {item.pending ? "Spec TBC" : item.tag}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {item.blurb}
              </p>

              {item.specs.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.specs.map((spec) => (
                    <li
                      key={spec}
                      className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
              ) : null}

              {item.badges.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <li
                      key={badge}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent"
                    >
                      <span className="size-1.5 rounded-full bg-accent" />
                      {badge}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-auto pt-6">
                {internal ? (
                  <Link href={item.href}>{cta}</Link>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    {cta}
                  </a>
                )}
              </div>
              </div>
            </SpotlightCard>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

"use client";

import Image from "next/image";
import { ArrowUpRightIcon, ClockIcon, EyeIcon, PlayIcon } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { twitchChannel } from "@/lib/site";
import type { TwitchClip } from "@/lib/twitch";

const numberFormat = new Intl.NumberFormat("en-US");

function formatClipDuration(seconds: number) {
  const whole = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function TwitchClips({ clips }: { clips: TwitchClip[] }) {
  if (clips.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="Highlights"
        title="Best of the stream"
        description="Top clips from the Twitch channel — the moments that made chat lose it."
      />

      <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {clips.map((clip) => (
          <StaggerItem key={clip.id}>
            <a
              href={clip.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <SpotlightCard className="group/card h-full p-0">
                <div className="relative aspect-video overflow-hidden">
                  {clip.thumbnail ? (
                    <Image
                      src={clip.thumbnail}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06]"
                    />
                  ) : (
                    <span className="block size-full bg-muted" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="flex size-11 scale-90 items-center justify-center rounded-full bg-primary/90 text-primary-foreground opacity-80 shadow-[0_0_24px_-4px_var(--glow-emerald)] transition-all duration-300 group-hover/card:scale-100 group-hover/card:opacity-100">
                      <PlayIcon className="size-4 translate-x-px fill-current" />
                    </span>
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm leading-snug font-medium transition-colors group-hover/card:text-primary">
                    {clip.title}
                  </h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <EyeIcon className="size-3" aria-hidden />
                      {numberFormat.format(clip.views)}{" "}
                      {clip.views === 1 ? "view" : "views"}
                    </span>
                    {clip.duration > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <ClockIcon className="size-3" aria-hidden />
                        {formatClipDuration(clip.duration)} long
                      </span>
                    ) : null}
                  </p>
                </div>
              </SpotlightCard>
            </a>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-6">
        <a
          href={`${twitchChannel}/clips`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          All clips on Twitch
          <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </Section>
  );
}

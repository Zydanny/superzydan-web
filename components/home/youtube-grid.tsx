"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRightIcon, ClockIcon, EyeIcon, PlayIcon } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { VideoModal } from "@/components/video-modal";
import type { VideoMeta } from "@/lib/site";

export function YoutubeGrid({
  videos,
  eyebrow = "VODs",
  title = "Latest from the channel",
  description = "The newest landscape streams from the channel, pulled straight from YouTube. Tap any card for a quick preview without leaving the page.",
}: {
  videos: VideoMeta[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const [active, setActive] = useState<VideoMeta | null>(null);

  return (
    <Section>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {videos.map((video) => (
          <StaggerItem key={video.id}>
            <SpotlightCard className="group/card p-0">
              <button
                type="button"
                onClick={() => setActive(video)}
                aria-label={`Preview ${video.title}`}
                className="block w-full cursor-pointer text-left"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Play affordance scales up and brightens on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="flex size-14 scale-90 items-center justify-center rounded-full bg-primary/90 text-primary-foreground opacity-75 shadow-[0_0_30px_-4px_var(--glow-emerald)] backdrop-blur-sm transition-all duration-300 ease-out group-hover/card:scale-100 group-hover/card:opacity-100">
                      <PlayIcon className="size-5 translate-x-px fill-current" />
                    </span>
                  </span>

                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="glass rounded-full px-2.5 py-1 text-[11px] font-medium">
                      {video.tag}
                    </span>
                  </div>

                  {(video.duration || video.views) && (
                    <div className="absolute right-3 bottom-3 flex gap-2">
                      {video.views ? (
                        <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] tabular-nums">
                          <EyeIcon className="size-3" />
                          {video.views}
                        </span>
                      ) : null}
                      {video.duration ? (
                        <span className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] tabular-nums">
                          <ClockIcon className="size-3" />
                          {video.duration}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-base leading-snug font-medium transition-colors group-hover/card:text-primary">
                    {video.title}
                  </h3>
                  <p className="text-eyebrow mt-3 text-muted-foreground">
                    Quick preview
                  </p>
                </div>
              </button>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-8">
        <a
          href="https://www.youtube.com/@SuperZydan/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          All VODs on YouTube
          <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </Section>
  );
}

"use client";

import { useState } from "react";
import { Screen } from "@/components/home/watch";
import { TubeSign } from "@/components/sign-heading";
import { VideoModal } from "@/components/video-modal";
import type { VideoMeta } from "@/lib/site";

/*
 * The channel's landscape uploads as two walls of screens: edited videos and
 * stream replays. Tapping one plays it right here.
 */
export function VodGrid({ videos }: { videos: VideoMeta[] }) {
  const [playing, setPlaying] = useState<VideoMeta | null>(null);
  const groups = [
    { title: "Videos", tone: "magenta" as const, items: videos.filter((video) => video.tag !== "Live VOD") },
    { title: "Stream replays", tone: "cyan" as const, items: videos.filter((video) => video.tag === "Live VOD") },
  ].filter((group) => group.items.length > 0);

  return (
    <>
      {groups.map((group, groupIndex) => (
        <section key={group.title} aria-label={group.title} className={groupIndex > 0 ? "mt-16 lg:mt-20" : undefined}>
          <TubeSign as="h2" tone={group.tone}>
            {group.title}
          </TubeSign>
          <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.items.map((video, index) => (
              <li key={video.id}>
                <button
                  type="button"
                  onClick={() => setPlaying(video)}
                  className="group/card block w-full cursor-pointer text-left"
                >
                  <Screen
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    priority={groupIndex === 0 && index === 0}
                    deferred={groupIndex > 0 || index > 0}
                  />
                  <span className="mt-3 line-clamp-2 block font-semibold text-pretty transition-colors group-hover/card:text-neon-cyan">
                    {video.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </>
  );
}

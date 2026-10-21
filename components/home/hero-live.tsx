"use client";

import { useState } from "react";
import { PlayIcon } from "lucide-react";
import { cn } from "cn";
import { DiscordMark } from "@/components/discord-mark";
import { NeonButton } from "@/components/neon-button";
import { useTwitchStatus } from "@/components/twitch-status-provider";
import { VideoModal } from "@/components/video-modal";
import { discordInvite, type VideoMeta } from "@/lib/site";

/*
 * The red LIVE tube. It's wired to the real Twitch status: switched off (dark
 * tube, no glow) unless the API says the stream is on. Keying on the state
 * remounts the sign, so it replays the power-on flicker the moment the stream
 * starts.
 */
export function LiveSign({ className }: { className?: string }) {
  const { isLive, title } = useTwitchStatus();

  const sign = (
    <span
      key={isLive ? "on" : "off"}
      aria-hidden
      className={cn(
        "font-display block border-2 px-3 py-0.5 text-xl leading-tight font-black tracking-[0.22em] uppercase lg:text-2xl",
        isLive
          ? "neon-live animate-tube-on rounded-md border-live shadow-[0_0_6px_var(--live),0_0_16px_-2px_var(--live),inset_0_0_10px_-2px_var(--live)]"
          : "neon-off rounded-md border-[#86505c]/60",
      )}
    >
      Live
    </span>
  );

  if (!isLive) {
    return (
      <div className={className}>
        {sign}
        <span className="sr-only">Not live right now</span>
      </div>
    );
  }

  return (
    <a
      href="#watch"
      className={cn("block transition-transform duration-150 active:scale-[0.97]", className)}
      aria-label={title ? `Live now on Twitch: ${title}` : "Live now on Twitch"}
    >
      {sign}
    </a>
  );
}

/*
 * Watch does the useful thing for the current state: jumps to the live player
 * when the stream is on, otherwise plays the newest video right here.
 */
export function HeroActions({ latestVideo }: { latestVideo: VideoMeta | null }) {
  const { isLive } = useTwitchStatus();
  const [playing, setPlaying] = useState<VideoMeta | null>(null);

  return (
    // Two up on phones (short labels so both fit), wrapping rows from sm up so
    // the pair never runs into the stage at in-between widths.
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      {isLive || !latestVideo ? (
        <NeonButton href="#watch" className="px-4 sm:px-7">
          <PlayIcon className="size-4 fill-current" />
          {isLive ? "Watch live" : "Watch"}
        </NeonButton>
      ) : (
        <NeonButton onClick={() => setPlaying(latestVideo)} className="px-4 sm:px-7">
          <PlayIcon className="size-4 fill-current" />
          <span>
            Watch<span className="sr-only sm:not-sr-only"> the newest video</span>
          </span>
        </NeonButton>
      )}
      <NeonButton href={discordInvite} external variant="outline" className="px-4 sm:px-7">
        <DiscordMark className="size-4" />
        <span>
          <span className="sr-only sm:not-sr-only">Join the </span>Discord
        </span>
      </NeonButton>
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

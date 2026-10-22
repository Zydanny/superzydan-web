"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon, PlayIcon } from "lucide-react";
import { cn } from "cn";
import { useTwitchStatus } from "@/components/twitch-status-provider";
import { VideoModal } from "@/components/video-modal";
import { twitchChannel, twitchUsername, type VideoMeta } from "@/lib/site";
import type { TwitchClip } from "@/lib/twitch";
import { twitchPlayerSrc } from "@/lib/twitch-embed";

// Fixed locale so the server and client format numbers identically.
const numberFormat = new Intl.NumberFormat("en-US");

function plural(count: number, word: string) {
  return `${numberFormat.format(count)} ${count === 1 ? word : `${word}s`}`;
}

function clipLength(seconds: number) {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/*
 * One place to watch: the stream (live player, or the last broadcast when
 * offline), the newest uploads, and the best clips. Replaces the separate
 * stream, clips and newest-videos sections.
 */
export function Watch({ videos, clips }: { videos: VideoMeta[]; clips: TwitchClip[] }) {
  const [playing, setPlaying] = useState<VideoMeta | null>(null);

  return (
    <section id="watch" aria-labelledby="watch-title" className="scroll-mt-24 py-14 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div>
          <h2
            id="watch-title"
            className="font-display neon-cyan text-6xl leading-[0.85] font-black uppercase lg:text-8xl"
          >
            Watch
          </h2>
          <p className="mt-3 max-w-sm text-lg text-haze">
            Streams, clips and videos, newest first.
          </p>
        </div>

        <StreamSlot />

        {videos.length > 0 ? (
          <Rail
            title="Newest videos"
            tone="magenta"
            more={{ href: "/vods", label: "All videos", external: false }}
          >
            {videos.map((video, index) => (
              <li key={video.id} className="snap-start">
                <button
                  type="button"
                  onClick={() => setPlaying(video)}
                  className="group/card block w-full cursor-pointer text-left"
                >
                  <Screen
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    badge={index === 0 ? "Newest" : undefined}
                  />
                  <p className="mt-3 line-clamp-2 font-semibold text-pretty transition-colors group-hover/card:text-neon-cyan">
                    {video.title}
                  </p>
                  {video.tag === "Live VOD" ? (
                    <p className="mt-1 text-sm text-haze">Stream replay</p>
                  ) : null}
                </button>
              </li>
            ))}
          </Rail>
        ) : null}

        {clips.length > 0 ? (
          <Rail
            title="Best clips"
            tone="cyan"
            more={{ href: `${twitchChannel}/clips`, label: "All clips", external: true }}
          >
            {clips.map((clip) => (
              <li key={clip.id} className="snap-start">
                <a
                  href={clip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/card block"
                >
                  <Screen src={clip.thumbnail} />
                  <p className="mt-3 line-clamp-2 font-semibold text-pretty transition-colors group-hover/card:text-neon-cyan">
                    {clip.title}
                  </p>
                  <p className="mt-1 text-sm text-haze">
                    {plural(clip.views, "view")}
                    {clip.duration > 0 ? (
                      <>
                        <span aria-hidden> · </span>
                        <span className="sr-only">, </span>
                        {clipLength(clip.duration)} long
                      </>
                    ) : null}
                  </p>
                </a>
              </li>
            ))}
          </Rail>
        ) : null}
      </div>

      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

/*
 * The big screen. Live: a poster that only loads the Twitch player once
 * someone taps it, so the page never pulls Twitch's ~100 requests up front.
 * Offline: the last broadcast as a replay, with a quiet note that I'm off air.
 */
function StreamSlot() {
  const status = useTwitchStatus();
  const [playerOn, setPlayerOn] = useState(false);

  if (status.isLive) {
    return (
      <div className="screen-on mt-10 lg:mt-14">
        {/* The screen hangs from two wires, like the signs. */}
        <div aria-hidden className="relative before:absolute before:-top-10 before:left-[14%] before:h-10 before:w-px before:bg-[#4a3f63] after:absolute after:-top-10 after:right-[14%] after:h-10 after:w-px after:bg-[#4a3f63] lg:before:-top-14 lg:before:h-14 lg:after:-top-14 lg:after:h-14" />
        <div className="chamfer bg-live p-[2px] [--cut:14px]">
          <div className="chamfer relative aspect-video overflow-hidden bg-black [--cut:13px]">
            {playerOn ? (
              <iframe
                title={`${status.title ?? "SuperZydan live"} on Twitch`}
                src={twitchPlayerSrc(true)}
                allowFullScreen
                className="size-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlayerOn(true)}
                className="group/live absolute inset-0 cursor-pointer"
                aria-label="Play the live stream here"
              >
                {/* Twitch's own live preview frame; plain img since it changes every few minutes. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchUsername}-1280x720.jpg`}
                  alt=""
                  className="size-full object-cover opacity-80 transition-opacity duration-200 group-hover/live:opacity-100"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="chamfer grid size-16 place-items-center bg-live text-white transition-transform duration-150 group-active/live:scale-[0.97] lg:size-20">
                    <PlayIcon className="size-7 translate-x-0.5 fill-current" />
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display neon-live text-xl font-black tracking-[0.2em] uppercase">
              Live now
            </p>
            <p className="mt-1 text-lg font-semibold">{status.title ?? "SuperZydan is live"}</p>
            <p className="text-sm text-haze">
              {[status.game, status.viewers !== null ? plural(status.viewers, "viewer") : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <OutLink href={twitchChannel}>Open on Twitch</OutLink>
        </div>
      </div>
    );
  }

  const last = status.lastStream;

  return (
    <div className="screen-on mt-10 grid gap-5 lg:mt-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
      {last ? (
        <a
          href={last.url}
          target="_blank"
          rel="noopener noreferrer"
          // Hung from two wires up to the WATCH sign, like the tubes on the street.
          className="group/card relative before:absolute before:-top-10 before:left-[14%] before:h-10 before:w-px before:bg-[#4a3f63] after:absolute after:-top-10 after:right-[14%] after:h-10 after:w-px after:bg-[#4a3f63] lg:before:-top-14 lg:before:h-14 lg:after:-top-14 lg:after:h-14 block"
          aria-label={`Watch the replay: ${last.title}`}
        >
          <Screen src={last.thumbnail} large />
        </a>
      ) : null}
      <div>
        {last ? (
          <>
            <h3 className="text-2xl font-bold text-balance lg:text-3xl">
              <a
                href={last.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-neon-cyan"
              >
                Last stream: {last.title}
              </a>
            </h3>
            <p className="mt-2 text-haze">
              {[
                status.configured ? "Off air right now" : null,
                last.views !== null ? plural(last.views, "view") : null,
                last.duration ? `${last.duration} long` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </>
        ) : (
          <h3 className="text-2xl font-bold text-balance lg:text-3xl">
            {status.configured ? "Off air right now. " : null}Catch the next one live
            on Twitch.
          </h3>
        )}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          {last ? <OutLink href={last.url}>Watch the replay</OutLink> : null}
          <OutLink href={twitchChannel}>Follow on Twitch</OutLink>
        </div>
      </div>
    </div>
  );
}

function Rail({
  title,
  tone,
  more,
  children,
}: {
  title: string;
  tone: "magenta" | "cyan";
  more: { href: string; label: string; external: boolean };
  children: React.ReactNode;
}) {
  return (
    <div className="mt-14 lg:mt-20">
      <div className="flex items-center justify-between gap-4">
        {/* Each rail is a small lit tube sign, same build as CO-OP and NIGHT. */}
        <h3
          className={cn(
            "font-display rounded-md border-2 px-3 py-1 text-2xl leading-none font-black tracking-[0.08em] uppercase lg:text-3xl",
            tone === "magenta"
              ? "neon-magenta border-neon-magenta shadow-[0_0_6px_var(--neon-magenta),0_0_16px_-2px_var(--neon-magenta),inset_0_0_8px_-2px_var(--neon-magenta)]"
              : "neon-cyan border-neon-cyan shadow-[0_0_6px_var(--neon-cyan),0_0_16px_-2px_var(--neon-cyan),inset_0_0_8px_-2px_var(--neon-cyan)]",
          )}
        >
          {title}
        </h3>
        {more.external ? (
          <OutLink href={more.href}>{more.label}</OutLink>
        ) : (
          <Link
            href={more.href}
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-neon-cyan transition-colors hover:text-white"
          >
            {more.label}
            <ArrowRightIcon className="size-4" />
          </Link>
        )}
      </div>
      {/*
        A swipeable row on phones (the next card peeks in so it reads as
        scrollable), a plain grid on desktop. `relative` matters: it keeps the
        absolutely positioned sr-only text in off-screen cards inside the
        scroller, otherwise mobile Chrome widens the page and zooms it out.
      */}
      <ul className="relative -mx-4 mt-5 grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:auto-cols-[45%] lg:mx-0 lg:grid-flow-row lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
        {children}
      </ul>
    </div>
  );
}

/*
 * A thumbnail mounted like a screen on the wall: cut corners, a violet frame
 * that lights cyan on hover or keyboard focus.
 */
export function Screen({
  src,
  badge,
  large = false,
}: {
  src: string | null;
  badge?: string;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "chamfer p-[2px] transition-colors duration-200 group-hover/card:bg-neon-cyan group-focus-visible/card:bg-neon-cyan",
        large ? "bg-neon-cyan/80 [--cut:14px]" : "bg-neon-violet/40 [--cut:10px]",
      )}
    >
      <div
        className={cn(
          "chamfer relative aspect-video overflow-hidden bg-night-raised",
          large ? "[--cut:13px]" : "[--cut:9px]",
        )}
      >
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes={large ? "(min-width: 1024px) 700px, 100vw" : "(min-width: 1024px) 300px, 78vw"}
            className="object-cover transition-transform duration-300 ease-(--ease-out) group-hover/card:scale-[1.03]"
          />
        ) : null}
        <span className="absolute inset-0 grid place-items-center opacity-85 transition-opacity duration-200 group-hover/card:opacity-100">
          <span className="chamfer grid size-12 place-items-center bg-neon-magenta text-primary-foreground [--cut:6px]">
            <PlayIcon className="size-5 translate-x-px fill-current" />
          </span>
        </span>
        {badge ? (
          <span className="absolute top-2 left-2 bg-paint-yellow px-2 py-0.5 text-xs font-extrabold tracking-wide text-night uppercase">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-neon-cyan transition-colors hover:text-white"
    >
      {children}
      <ArrowUpRightIcon className="size-4" />
    </a>
  );
}

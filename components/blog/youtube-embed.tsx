"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PlayIcon } from "lucide-react";
import { cn } from "cn";

/* Seconds from a YouTube `t` value: "433", "433s" or "7m13s". */
function parseSeconds(value: string): number | null {
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(value);
  if (!match || !value) return null;
  const [, h = "0", m = "0", s = "0"] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

/* The start time of a link to this same video with a timestamp, like the post's chapter list. */
function timestampFor(anchor: HTMLAnchorElement, id: string): number | null {
  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(?:www|m)\./, "");
  const linkId =
    host === "youtu.be" ? url.pathname.slice(1) : host === "youtube.com" ? url.searchParams.get("v") : null;
  const t = url.searchParams.get("t");
  return linkId === id && t ? parseSeconds(t) : null;
}

/*
 * Shows the thumbnail and only loads YouTube's player when tapped, so a post
 * with a video costs one image on first load instead of the whole player.
 * Timestamp links to the same video anywhere on the page seek this player
 * instead of opening YouTube (they still open YouTube without JavaScript).
 */
export function YouTubeEmbed({
  id,
  title = "YouTube video",
  short = false,
  className,
}: {
  id: string;
  title?: string;
  /** Vertical Shorts render 9:16 and narrower. */
  short?: boolean;
  className?: string;
}) {
  // null until the viewer asks for the video; then the second it starts from.
  const [start, setStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);

  const playFrom = useCallback((seconds: number) => {
    const player = iframeRef.current?.contentWindow;
    if (player && readyRef.current) {
      // enablejsapi=1 lets the page drive the already-loaded player without reloading it.
      for (const [func, args] of [
        ["seekTo", [seconds, true]],
        ["playVideo", []],
      ] as const) {
        player.postMessage(JSON.stringify({ event: "command", func, args }), "https://www.youtube-nocookie.com");
      }
    } else {
      readyRef.current = false;
      setStart(seconds);
    }
  }, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Ctrl/Cmd/middle-click still opens YouTube in a new tab.
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const seconds = timestampFor(anchor, id);
      if (seconds === null) return;

      event.preventDefault();
      playFrom(seconds);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      containerRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      iframeRef.current?.focus({ preventScroll: true });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [id, playFrom]);

  // Keyboard users land on the player instead of losing focus when the thumbnail button disappears.
  useEffect(() => {
    if (start !== null) iframeRef.current?.focus({ preventScroll: true });
  }, [start]);

  return (
    <div
      ref={containerRef}
      className={cn(
        // A screen on the wall, like the Watch section: cut corners, a lit edge.
        "chamfer relative my-8 bg-neon-cyan/70 p-[2px] [--cut:14px]",
        short ? "mx-auto w-full max-w-xs" : "w-full",
        className,
      )}
    >
      <div
        className={cn(
          "chamfer relative overflow-hidden bg-night-raised [--cut:13px]",
          short ? "aspect-[9/16]" : "aspect-video",
        )}
      >
      {start !== null ? (
        <iframe
          ref={iframeRef}
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&enablejsapi=1&start=${start}`}
          onLoad={() => {
            readyRef.current = true;
          }}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => playFrom(0)}
          className="group absolute inset-0 size-full cursor-pointer focus-visible:outline-none"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes={short ? "320px" : "(max-width: 768px) 100vw, 768px"}
            className="object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span className="absolute inset-0 bg-night/25 transition-colors duration-200 group-hover:bg-night/5" />
          <span className="absolute inset-0 ring-neon-cyan ring-inset group-focus-visible:ring-4" />
          <span className="chamfer absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center bg-neon-magenta text-primary-foreground transition-transform duration-150 ease-(--ease-out) [--cut:8px] group-active:scale-[0.97] lg:size-20">
            <PlayIcon className="ml-1 size-7 fill-current" />
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
      </div>
    </div>
  );
}

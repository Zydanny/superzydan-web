"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "lucide-react";
import { cn } from "cn";

/*
 * Shows the thumbnail and only loads YouTube's player when tapped, so a post
 * with a video costs one image on first load instead of the whole player.
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
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn(
        "not-prose relative my-8 overflow-hidden rounded-2xl border border-border bg-muted",
        short ? "mx-auto aspect-[9/16] w-full max-w-xs" : "aspect-video w-full",
        className,
      )}
    >
      {playing ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes={short ? "320px" : "(max-width: 768px) 100vw, 768px"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
          <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none">
            <PlayIcon className="ml-1 size-7 fill-current" />
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRightIcon, PlayIcon } from "lucide-react";
import { isAffiliateUrl } from "@/lib/affiliate";
import type { ChannelUpload } from "@/lib/youtube";

const PAGE_SIZE = 12;

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/*
 * Reviews-channel Shorts without a write-up. The Short opens on YouTube; the
 * shop link is the first product link from its description.
 */
export function QuickTakes({ shorts }: { shorts: ChannelUpload[] }) {
  const [shown, setShown] = useState(PAGE_SIZE);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shorts.slice(0, shown).map((short) => (
          <li key={short.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
            <a
              href={`https://www.youtube.com/shorts/${short.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/short relative block aspect-[9/16] overflow-hidden bg-muted"
            >
              {/* hqdefault letterboxes a Short inside 4:3; a centered 9:16 crop is exactly the Short's frame. */}
              <Image
                src={`https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover/short:scale-105 motion-reduce:transition-none"
              />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white">
                <PlayIcon className="ml-0.5 size-4 fill-current" />
              </span>
              <span className="absolute inset-x-3 bottom-3 line-clamp-3 text-sm leading-snug font-medium text-white">
                {short.title}
              </span>
              <span className="sr-only">(opens the Short on YouTube)</span>
            </a>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <time dateTime={short.date} className="text-[11px] text-muted-foreground">
                {formatDate(short.date)}
              </time>
              {short.productUrl ? (
                <a
                  href={short.productUrl}
                  target="_blank"
                  rel={
                    isAffiliateUrl(short.productUrl) ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"
                  }
                  className="mt-auto inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Check it out
                  <ArrowUpRightIcon className="size-3.5" />
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {shown < shorts.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((count) => count + PAGE_SIZE)}
            className="glass min-h-11 cursor-pointer rounded-full px-6 text-sm font-medium transition-colors hover:text-primary"
          >
            Show more ({shorts.length - shown} left)
          </button>
        </div>
      ) : null}
    </>
  );
}

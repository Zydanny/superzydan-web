"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRightIcon, PlayIcon } from "lucide-react";
import { isAffiliateUrl } from "@/lib/affiliate";
import type { ChannelUpload } from "@/lib/youtube";

const PAGE_SIZE = 8;

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/*
 * Reviews-channel Shorts without a write-up: tall screens in the same frame as
 * the Watch thumbnails. The Short opens on YouTube; the shop link is the first
 * product link from its description.
 */
export function QuickTakes({ shorts }: { shorts: ChannelUpload[] }) {
  const [shown, setShown] = useState(PAGE_SIZE);

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {shorts.slice(0, shown).map((short) => (
          <li key={short.id} className="flex flex-col">
            <a
              href={`https://www.youtube.com/shorts/${short.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/short chamfer block bg-neon-violet/40 p-[2px] transition-colors duration-200 [--cut:10px] hover:bg-neon-cyan focus-visible:bg-neon-cyan"
            >
              <span className="chamfer relative block aspect-[9/16] overflow-hidden bg-night-raised [--cut:9px]">
                {/* hqdefault letterboxes a Short inside 4:3; a centered 9:16 crop is exactly the Short's frame. */}
                <Image
                  src={`https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 ease-(--ease-out) group-hover/short:scale-[1.03] motion-reduce:transition-none"
                />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/90 to-transparent" />
                <span className="chamfer absolute top-2 right-2 grid size-9 place-items-center bg-neon-magenta text-primary-foreground [--cut:5px]">
                  <PlayIcon className="ml-0.5 size-4 fill-current" />
                </span>
                <span className="absolute inset-x-3 bottom-3 line-clamp-3 text-sm leading-snug font-bold text-white">
                  {short.title}
                </span>
                <span className="sr-only">(opens the Short on YouTube)</span>
              </span>
            </a>
            <time dateTime={short.date} className="mt-2.5 text-xs font-semibold text-haze">
              {formatDate(short.date)}
            </time>
            {short.productUrl ? (
              <a
                href={short.productUrl}
                target="_blank"
                rel={isAffiliateUrl(short.productUrl) ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-semibold text-neon-cyan transition-colors hover:text-white"
              >
                Check it out
                <ArrowUpRightIcon className="size-4" />
              </a>
            ) : null}
          </li>
        ))}
      </ul>

      {shown < shorts.length ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((count) => count + PAGE_SIZE)}
            className="group/more relative isolate inline-flex min-h-12 cursor-pointer items-center px-6 font-extrabold tracking-wide text-neon-cyan uppercase transition-transform duration-150 ease-(--ease-out) active:scale-[0.97] [--cut:10px]"
          >
            <span aria-hidden className="chamfer absolute inset-0 -z-10 bg-neon-cyan" />
            <span
              aria-hidden
              className="chamfer absolute inset-[2px] -z-10 bg-night transition-colors duration-200 group-hover/more:bg-[#0b1a22]"
            />
            Show more ({shorts.length - shown} left)
          </button>
        </div>
      ) : null}
    </>
  );
}

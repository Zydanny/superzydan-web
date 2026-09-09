"use client";

import { ArrowRightIcon, EyeIcon } from "lucide-react";
import { cn } from "cn";
import { useTwitchStatus } from "@/components/twitch-status-provider";
import { twitchChannel } from "@/lib/site";

// Fixed locale so the server and client format viewer counts identically.
const numberFormat = new Intl.NumberFormat("en-US");

/* Red pulsing dot while live, flat muted dot otherwise. */
export function StatusDot({ live }: { live: boolean }) {
  if (!live) {
    return (
      <span className="size-2 rounded-full bg-muted-foreground/60" aria-hidden />
    );
  }

  return (
    <span className="relative flex size-2" aria-hidden>
      <span className="animate-live-ping absolute inline-flex size-full rounded-full bg-destructive" />
      <span className="relative inline-flex size-2 rounded-full bg-destructive" />
    </span>
  );
}

/*
 * Hero pill. Reflects the real channel state, so it only says LIVE NOW when
 * the Twitch API reports an active stream. Without API credentials it falls
 * back to a neutral label instead of guessing.
 */
export function TwitchStatusPill({ className }: { className?: string }) {
  const status = useTwitchStatus();

  const label = !status.configured
    ? "Twitch stream status"
    : status.isLive
      ? "Live now"
      : "Offline";

  return (
    <a
      href={twitchChannel}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "glass group inline-flex w-fit items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 text-sm transition-colors",
        status.isLive
          ? "border-destructive/40 text-foreground hover:border-destructive/70"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <StatusDot live={status.isLive} />
      <span
        className={cn(
          "font-semibold tracking-wide uppercase",
          status.isLive ? "text-destructive" : "text-foreground",
        )}
      >
        {label}
      </span>

      {status.isLive && status.game ? (
        <>
          <span className="h-3.5 w-px bg-border" />
          <span className="max-w-40 truncate">{status.game}</span>
        </>
      ) : null}

      {status.isLive && status.viewers !== null ? (
        <>
          <span className="h-3.5 w-px bg-border" />
          <span className="inline-flex items-center gap-1">
            <EyeIcon className="size-3.5" />
            {numberFormat.format(status.viewers)}
          </span>
        </>
      ) : null}

      {!status.isLive ? (
        <>
          <span className="h-3.5 w-px bg-border" />
          <span>Follow on Twitch</span>
        </>
      ) : null}

      <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

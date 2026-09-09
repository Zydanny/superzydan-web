"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRightIcon,
  EyeIcon,
  GamepadIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "cn";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { ShimmerButton } from "@/components/shimmer-button";
import { StatusDot } from "@/components/twitch-status-badge";
import { useTwitchStatus } from "@/components/twitch-status-provider";
import { twitchChannel, twitchUsername } from "@/lib/site";
import { twitchChatSrc, twitchPlayerSrc } from "@/lib/twitch-embed";

const numberFormat = new Intl.NumberFormat("en-US");

export function TwitchLive() {
  const status = useTwitchStatus();
  const isLive = status.isLive;

  return (
    <Section id="stream">
      <Reveal className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            {/*
              The eyebrow is driven by the API rather than hardcoded, so it no
              longer claims "Live now" while the channel is offline.
            */}
            <span
              className={cn(
                "text-eyebrow inline-flex items-center gap-2",
                isLive ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <StatusDot live={isLive} />
              {status.configured
                ? isLive
                  ? "Live now"
                  : "Offline"
                : "Stream"}
            </span>

            <h2 className="text-display mt-3 text-3xl md:text-4xl">
              {isLive ? "SuperZydan is live right now" : "Watch the stream right here"}
            </h2>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              {isLive
                ? status.title ??
                  "The stream is running — hit play and jump into chat."
                : "The player below is wired straight to the Twitch channel. The moment the stream starts it plays right here, and this whole section switches to live."}
            </p>
          </div>

          {/*
            Big, unmissable state chip — only rendered once the Twitch API can
            actually tell us the answer, so it never guesses.
          */}
          {status.configured ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isLive ? "live" : "offline"}
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "inline-flex items-center gap-3 rounded-2xl border px-5 py-3",
                  isLive
                    ? "border-destructive/50 bg-destructive/12 shadow-[0_0_36px_-12px_var(--destructive)]"
                    : "glass",
                )}
              >
                <StatusDot live={isLive} />
                <span
                  className={cn(
                    "text-lg font-semibold tracking-tight",
                    isLive ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {isLive ? "LIVE NOW" : "OFFLINE"}
                </span>
                {isLive && status.viewers !== null ? (
                  <span className="inline-flex items-center gap-1.5 border-l border-destructive/30 pl-3 text-sm text-foreground">
                    <EyeIcon className="size-4" />
                    {numberFormat.format(status.viewers)} watching
                  </span>
                ) : null}
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </Reveal>

      <Reveal>
        <div
          className={cn(
            "overflow-hidden rounded-2xl p-2 transition-shadow duration-500",
            isLive
              ? "border border-destructive/40 bg-destructive/5 shadow-[0_0_80px_-30px_var(--destructive)]"
              : "glass",
          )}
        >
          <div className="grid gap-2 lg:grid-cols-[1fr_340px]">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                title={`${twitchUsername} live stream`}
                src={twitchPlayerSrc(isLive)}
                allowFullScreen
                className="size-full border-0"
              />
            </div>

            {/*
              Chat is only useful during a broadcast; when offline that column
              becomes a "what's next" panel instead of an empty black box.
            */}
            {isLive ? (
              <div className="hidden h-full min-h-[320px] overflow-hidden rounded-xl bg-black lg:block">
                <iframe
                  title={`${twitchUsername} live chat`}
                  src={twitchChatSrc()}
                  className="size-full border-0"
                />
              </div>
            ) : (
              <div className="hidden h-full min-h-[320px] flex-col gap-4 rounded-xl border border-border/60 bg-card/40 p-5 lg:flex">
                {/*
                  Rather than generic filler, the offline column surfaces the
                  most recent past broadcast straight from the Twitch API.
                */}
                {status.lastStream ? (
                  <a
                    href={status.lastStream.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/vod block"
                  >
                    <span className="text-eyebrow text-muted-foreground">
                      Last stream
                    </span>

                    <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                      {status.lastStream.thumbnail ? (
                        <Image
                          src={status.lastStream.thumbnail}
                          alt=""
                          fill
                          sizes="320px"
                          className="object-cover transition-transform duration-700 ease-out group-hover/vod:scale-105"
                        />
                      ) : null}
                      <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      <span className="absolute right-2 bottom-2 flex gap-1.5">
                        {status.lastStream.views !== null ? (
                          <span className="glass inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] tabular-nums">
                            <EyeIcon className="size-2.5" />
                            {numberFormat.format(status.lastStream.views)}
                          </span>
                        ) : null}
                        {status.lastStream.duration ? (
                          <span className="glass rounded-full px-2 py-0.5 text-[10px] tabular-nums">
                            {status.lastStream.duration}
                          </span>
                        ) : null}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-snug font-medium transition-colors group-hover/vod:text-primary">
                      {status.lastStream.title}
                    </p>
                  </a>
                ) : (
                  <div>
                    <span className="text-eyebrow text-muted-foreground">Offline</span>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Chat opens back up when the stream goes live. Follow on Twitch
                      for a notification.
                    </p>
                  </div>
                )}

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/60 pt-4">
                  {status.followers !== null ? (
                    <div>
                      <p className="text-display text-2xl">
                        {numberFormat.format(status.followers)}
                      </p>
                      <p className="text-eyebrow mt-1 text-muted-foreground">
                        Followers
                      </p>
                    </div>
                  ) : null}

                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 px-3 py-4">
            <ShimmerButton href={twitchChannel} external>
              <ArrowUpRightIcon className="size-4" />
              {isLive ? "Watch on Twitch" : "Follow on Twitch"}
            </ShimmerButton>

            {/* Current category while live, last-played category when not. */}
            {isLive && status.game ? (
              <span className="glass inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm text-muted-foreground">
                <GamepadIcon className="size-4" />
                {status.game}
              </span>
            ) : null}

            {!isLive && status.lastGame ? (
              <span className="glass inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm text-muted-foreground">
                <GamepadIcon className="size-4" />
                Last played{" "}
                <span className="text-foreground">{status.lastGame}</span>
              </span>
            ) : null}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

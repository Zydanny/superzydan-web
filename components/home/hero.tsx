"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRightIcon, MessageSquareIcon, PlayIcon } from "lucide-react";
import { cn } from "cn";
import { CountUp } from "@/components/count-up";
import { ShimmerButton } from "@/components/shimmer-button";
import { StatusDot, TwitchStatusPill } from "@/components/twitch-status-badge";
import { useTwitchStatus } from "@/components/twitch-status-provider";
import { VideoModal } from "@/components/video-modal";
import { discordInvite, heroLinks, heroStats, site, type VideoMeta } from "@/lib/site";
import { twitchPlayerSrc } from "@/lib/twitch-embed";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({
  youtubeSubscribers,
  latestVideo,
}: {
  youtubeSubscribers: number | null;
  latestVideo: VideoMeta | null;
}) {
  const stats = heroStats.map((stat) =>
    stat.label === "YouTube subs" && youtubeSubscribers !== null
      ? { ...stat, value: youtubeSubscribers }
      : stat,
  );

  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="hud-grid pointer-events-none absolute inset-0" />

      <motion.div
        style={reduceMotion ? undefined : { y, scale, opacity }}
        className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-center px-6 py-12 lg:px-12 lg:py-20"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-12">
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <TwitchStatusPill />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
              className="text-display mt-6 max-w-4xl text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {site.tagline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-300 lg:text-xl"
            >
              Chaotic gaming, cooking, and collabs — buckle up for the Zyverse. From
              Roblox nights to sweaty tactical sessions, custom boards, and kitchen
              experiments, this is the hub.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <ShimmerButton href="#stream" className="min-h-11">
                <PlayIcon className="size-4 fill-current" />
                Watch the stream
              </ShimmerButton>
              <a
                href={discordInvite}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex min-h-11 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
              >
                <MessageSquareIcon className="size-4" />
                Join Discord
              </a>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
              className="mt-8 flex flex-wrap gap-x-10 gap-y-5"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-eyebrow text-muted-foreground">{stat.label}</dt>
                  <dd className="text-display mt-2 text-3xl text-foreground md:text-4xl">
                    <CountUp value={stat.value} format={stat.format} />
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
            className="flex min-h-0 w-full lg:h-full lg:min-h-[36rem]"
          >
            <HeroFeatureCard latestVideo={latestVideo} />
          </motion.div>
        </div>

        <motion.nav
          aria-label="Explore"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {heroLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="glass group flex min-h-11 items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              {item.label}
              <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </motion.nav>
      </motion.div>
    </section>
  );
}

function HeroFeatureCard({ latestVideo }: { latestVideo: VideoMeta | null }) {
  const status = useTwitchStatus();
  const [preview, setPreview] = useState<VideoMeta | null>(null);
  const isLive = status.isLive;

  return (
    <>
      <div
        className={cn(
          "relative flex h-full w-full flex-col overflow-hidden rounded-3xl border p-2 shadow-[0_0_80px_-28px_var(--glow-emerald)] lg:p-3",
          isLive
            ? "border-destructive/45 bg-destructive/[0.06] shadow-[0_0_80px_-24px_var(--destructive)]"
            : "border-primary/35 bg-primary/[0.05]",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "animate-mesh pointer-events-none absolute -top-16 -right-10 size-72 rounded-full opacity-30 blur-3xl",
            isLive
              ? "bg-[radial-gradient(circle,var(--destructive),transparent_65%)]"
              : "bg-[radial-gradient(circle,var(--glow-emerald),transparent_65%)]",
          )}
        />

        {isLive ? (
          <div className="relative flex h-full min-h-0 flex-1 flex-col">
            <div className="aspect-video min-h-0 overflow-hidden rounded-2xl bg-black lg:aspect-auto lg:min-h-[28rem] lg:flex-1 xl:min-h-[34rem]">
              <iframe
                title={`${status.title ?? "Live stream"} player`}
                src={twitchPlayerSrc(true)}
                allowFullScreen
                className="size-full border-0"
              />
            </div>
            <div className="relative flex items-start justify-between gap-3 p-4 lg:p-5">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-destructive uppercase">
                  <StatusDot live />
                  Live on Twitch
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm font-medium lg:text-base">
                  {status.title ?? "SuperZydan is live"}
                </p>
                {status.game ? (
                  <p className="mt-1 text-xs text-muted-foreground">{status.game}</p>
                ) : null}
              </div>
              <ShimmerButton href="#stream" className="h-10 shrink-0 px-4">
                Watch
              </ShimmerButton>
            </div>
          </div>
        ) : latestVideo ? (
          <button
            type="button"
            onClick={() => setPreview(latestVideo)}
            className="group relative flex h-full min-h-0 w-full flex-1 cursor-pointer flex-col text-left"
            aria-label={`Preview ${latestVideo.title}`}
          >
            <div className="relative aspect-video min-h-0 overflow-hidden rounded-2xl bg-muted lg:aspect-auto lg:min-h-[28rem] lg:flex-1 xl:min-h-[34rem]">
              <Image
                src={`https://i.ytimg.com/vi/${latestVideo.id}/hqdefault.jpg`}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-[0_0_30px_-4px_var(--glow-emerald)] transition-transform duration-300 group-hover:scale-105 lg:size-20">
                  <PlayIcon className="size-5 translate-x-px fill-current lg:size-7" />
                </span>
              </span>
            </div>
            <div className="relative p-4 lg:p-5">
              <p className="text-eyebrow text-primary">
                {latestVideo.tag === "Live VOD" ? "Latest stream" : "Latest upload"}
              </p>
              <p className="mt-1.5 line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary lg:text-base">
                {latestVideo.title}
              </p>
            </div>
          </button>
        ) : (
          <Link
            href="#stream"
            className="relative flex aspect-video min-h-0 flex-1 items-end rounded-2xl bg-muted p-5 lg:aspect-auto lg:min-h-[28rem] xl:min-h-[34rem]"
          >
            <p className="text-sm text-muted-foreground">
              Watch the stream player below.
            </p>
          </Link>
        )}
      </div>
      <VideoModal video={preview} onClose={() => setPreview(null)} />
    </>
  );
}

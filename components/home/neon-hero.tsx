import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import { CountUp } from "@/components/count-up";
import { HeroActions, LiveSign } from "@/components/home/hero-live";
import { HeroSign } from "@/components/home/hero-sign";
import { socialStats, type VideoMeta } from "@/lib/site";

const HEADLINE = [
  ["Dad", "and", "son."],
  ["Gaming", "in", "the", "Zyverse."],
] as const;

/*
 * Paint specks from the logo, drifting slowly. They stay in the side margins
 * and the top of the stage so none of them lands inside the copy and reads as
 * a stray dot.
 */
const SPECKS = [
  { left: "8%", top: "12%", size: 6, color: "var(--paint-yellow)", speed: "11s" },
  { left: "88%", top: "9%", size: 8, color: "var(--neon-cyan)", speed: "13s" },
  { left: "97%", top: "48%", size: 5, color: "var(--paint-orange)", speed: "9s" },
  { left: "1.5%", top: "44%", size: 6, color: "var(--neon-magenta)", speed: "12s" },
  { left: "62%", top: "4%", size: 4, color: "var(--paint-orange)", speed: "10s" },
] as const;

type Stat = { label: string; value: number | null };

export function NeonHero({
  latestVideo,
  youtubeSubscribers,
  discordMembers,
}: {
  latestVideo: VideoMeta | null;
  youtubeSubscribers: number | null;
  discordMembers: number | null;
}) {
  const fallback = (label: string) =>
    socialStats.find((stat) => stat.label === label)?.value ?? null;

  const stats: Stat[] = [
    { label: "TikTok followers", value: fallback("TikTok") },
    { label: "YouTube subscribers", value: youtubeSubscribers ?? fallback("YouTube") },
    { label: "in the Discord", value: discordMembers },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SPECKS.map((speck, index) => (
          <span
            key={index}
            className="animate-speck absolute rounded-full opacity-70"
            style={
              {
                left: speck.left,
                top: speck.top,
                width: speck.size,
                height: speck.size,
                background: speck.color,
                "--speed": speck.speed,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-2 px-4 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:px-8 lg:pb-16">
        <Stage />

        {/*
          On phones the headline steps onto the faded floor of the stage, and
          the buttons come straight after it so both sit above the fold (the
          TikTok in-app browser leaves roughly 650px). The description follows.
        */}
        <div className="relative -mt-24 flex flex-col lg:order-first lg:mt-0">
          <h1
            id="hero-title"
            className="order-1 font-display text-[3.5rem] lg:order-none leading-[0.88] font-black tracking-[-0.01em] uppercase min-[400px]:text-6xl lg:text-7xl xl:text-[6rem]"
          >
            {HEADLINE.map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line.map((word, wordIndex) => {
                  const i = lineIndex * 3 + wordIndex;
                  return (
                    <Fragment key={word}>
                      <span
                        className={
                          word === "Zyverse."
                            ? "animate-word-in inline-block text-neon-magenta"
                            : "animate-word-in inline-block"
                        }
                        style={{ "--i": i, "--delay": "250ms" } as CSSProperties}
                      >
                        {word}
                      </span>
                      {wordIndex < line.length - 1 ? " " : null}
                    </Fragment>
                  );
                })}
              </span>
            ))}
          </h1>

          <p className="order-3 mt-5 max-w-md text-lg leading-snug text-haze lg:order-none lg:mt-5 lg:text-xl">
            Roblox, Minecraft and Switch co-op, plus my solo night streams and gear
            reviews.
          </p>

          <div className="order-2 mt-5 lg:order-none lg:mt-7">
            <HeroActions latestVideo={latestVideo} />
          </div>

          <dl className="order-4 mt-7 grid max-w-md grid-cols-3 gap-4 sm:gap-7 lg:order-none lg:mt-8">
            {stats
              .filter((stat) => stat.value !== null)
              .map((stat) => (
                // Reversed so <dt> stays first in the markup; justify-end keeps
                // every number on the top line even when a label wraps.
                <div key={stat.label} className="flex flex-col-reverse justify-end">
                  <dt className="text-sm font-semibold text-haze">{stat.label}</dt>
                  <dd className="font-display text-4xl leading-none font-black tabular-nums">
                    <CountUp value={stat.value!} />
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/*
 * The street corner: CO-OP and NIGHT tubes on the walls, the SZ logo as the
 * main sign, the LIVE tube by it, and the two of them standing under it.
 * The tubes power on once with a short stagger; after that only NIGHT hums now
 * and then. The logo stays steady (it's the page's LCP image, so it must paint
 * at once). All of it is opacity on static glow, and none of it runs with
 * reduced motion.
 */
function Stage() {
  return (
    <div className="relative mx-auto h-[27rem] w-full max-w-[34rem] min-[400px]:h-[30rem] lg:h-[48rem] lg:max-w-none">
      {/* Floor light the duo stands in, and the wet street under it. */}
      <div
        aria-hidden
        className="absolute inset-x-[-10%] bottom-0 h-[60%] bg-[radial-gradient(55%_40%_at_50%_58%,rgb(122_60_255/0.4),transparent_100%)]"
      />
      {/*
        The street. The floor line is where the two of them stand (on phones it
        sits just above the headline, which steps onto the floor below it).
        Each tube's light pools on the wet floor right under it: flattened
        static glows, nothing animated.
      */}
      <div
        aria-hidden
        className="absolute inset-x-2 bottom-[6.25rem] h-px bg-[linear-gradient(90deg,transparent,var(--neon-magenta)_20%,var(--neon-cyan)_80%,transparent)] opacity-60 lg:inset-x-6 lg:bottom-6"
      />
      <div
        aria-hidden
        className="absolute bottom-[5rem] -left-[6%] h-10 w-[34%] bg-[radial-gradient(closest-side,rgb(255_63_180/0.42),transparent)] lg:bottom-1 lg:-left-[2%] lg:w-[22%]"
      />
      <div
        aria-hidden
        className="absolute -right-[6%] bottom-[5rem] h-10 w-[34%] bg-[radial-gradient(closest-side,rgb(47_224_255/0.38),transparent)] lg:-right-[2%] lg:bottom-1 lg:w-[22%]"
      />

      <span
        aria-hidden
        className="font-display neon-magenta animate-tube-on absolute top-[24%] left-0 rounded-lg border-2 border-neon-magenta px-1.5 py-4 text-[1.6rem] before:absolute before:-top-5 before:left-1/2 before:h-5 before:w-px before:bg-[#4a3f63] min-[400px]:text-[1.9rem] leading-none font-black tracking-[0.14em] uppercase shadow-[0_0_6px_var(--neon-magenta),0_0_18px_-2px_var(--neon-magenta),inset_0_0_10px_-2px_var(--neon-magenta)] [writing-mode:vertical-rl] lg:left-2 lg:text-5xl"
        style={{ "--delay": "120ms" } as CSSProperties}
      >
        Co-op
      </span>
      <span
        aria-hidden
        className="font-display neon-cyan animate-tube-hum absolute top-[30%] right-0 rounded-lg border-2 border-neon-cyan px-1.5 py-4 text-[1.6rem] before:absolute before:-top-5 before:left-1/2 before:h-5 before:w-px before:bg-[#4a3f63] min-[400px]:text-[1.9rem] leading-none font-black tracking-[0.14em] uppercase shadow-[0_0_6px_var(--neon-cyan),0_0_18px_-2px_var(--neon-cyan),inset_0_0_10px_-2px_var(--neon-cyan)] [writing-mode:vertical-rl] lg:right-2 lg:text-5xl"
        style={{ "--delay": "320ms" } as CSSProperties}
      >
        Night
      </span>

      {/* Beside the logo on phones so the logo can sit high; centred above it on desktop. */}
      <LiveSign className="absolute top-1 left-0 z-10 lg:left-1/2 lg:-translate-x-1/2" />

      {/* Desktop upgrades this to a tilting 3D sign once the page has loaded; phones keep it as is. */}
      <HeroSign className="absolute top-1 left-1/2 w-[8.5rem] -translate-x-1/2 min-[400px]:w-[9.5rem] lg:top-12 lg:w-[17rem]">
        <Image
          src="/brand/sz-logo.webp"
          alt="SuperZydan graffiti logo"
          width={560}
          height={619}
          preload
          fetchPriority="high"
          // Decode with the first paint instead of after it, so the hero's LCP lands with FCP.
          decoding="sync"
          sizes="(min-width: 1024px) 272px, 168px"
          className="h-auto w-full drop-shadow-[0_0_18px_rgb(255_63_180/0.45)]"
        />
      </HeroSign>

      <Image
        src="/images/superzydan-linknova-cutout.webp"
        alt="SuperZydan and his son LinkNova standing back to back"
        width={682}
        height={1024}
        // Biggest image in the first viewport on phones, so usually the LCP.
        preload
        fetchPriority="high"
        decoding="sync"
        sizes="(min-width: 1024px) 420px, 200px"
        className="absolute bottom-0 left-1/2 h-[66%] w-auto -translate-x-1/2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_66%)] lg:h-[58%] lg:[mask-image:linear-gradient(to_bottom,#000_78%,transparent)]"
      />

      <NamePlate
        name="SuperZydan"
        role="Dad"
        tone="magenta"
        className="bottom-[38%] left-[3%] -rotate-3 lg:bottom-[30%] lg:left-[16%] xl:left-[12%]"
      />
      <NamePlate
        name="LinkNova"
        role="Son"
        tone="cyan"
        className="right-[3%] bottom-[28%] rotate-2 lg:bottom-[14%] lg:right-[12%]"
      />
    </div>
  );
}

function NamePlate({
  name,
  role,
  tone,
  className,
}: {
  name: string;
  role: string;
  tone: "magenta" | "cyan";
  className: string;
}) {
  const ring = tone === "magenta" ? "bg-neon-magenta" : "bg-neon-cyan";

  return (
    <div className={`absolute z-10 ${className}`}>
      <div className={`chamfer p-[2px] [--cut:9px] ${ring}`}>
        <p className="chamfer bg-night-raised px-3.5 py-1.5 [--cut:8px]">
          <span className="font-display block text-xl leading-none font-black tracking-wide uppercase min-[400px]:text-2xl">
            {name}
          </span>
          <span className="mt-0.5 block text-xs font-bold tracking-[0.14em] text-haze uppercase">
            {role}
          </span>
        </p>
      </div>
    </div>
  );
}

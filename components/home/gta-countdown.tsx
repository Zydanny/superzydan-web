"use client";

import { useEffect, useState } from "react";
import { NeonButton } from "@/components/neon-button";
import { gtaCountdown, twitchChannel } from "@/lib/site";

const launchAt = Date.parse(gtaCountdown.launchAt);
const hideAfter = Date.parse(gtaCountdown.hideAfter);

function split(msLeft: number) {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  return [
    { label: "days", value: Math.floor(total / 86400) },
    { label: "hours", value: Math.floor((total % 86400) / 3600) },
    { label: "min", value: Math.floor((total % 3600) / 60) },
    { label: "sec", value: total % 60 },
  ];
}

/*
 * One palm silhouette, drawn for this section: a leaning trunk and seven
 * fronds. Mirrored with scale-x-[-1] for the other side.
 */
function Palm({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 320" className={className} aria-hidden fill="currentColor">
      <path d="M96 320c4-60 10-120 30-178 4-12 9-22 14-30l7 4c-6 9-10 19-14 31-18 56-24 114-27 173z" />
      <path d="M142 112c-30-22-70-26-104-8 34-4 66 2 98 18z" />
      <path d="M142 112c-24-34-60-50-96-46 32 8 60 24 88 52z" />
      <path d="M144 110c-2-38 14-72 44-92-20 26-30 56-36 92z" />
      <path d="M144 112c24-28 54-36 56-34-26 6-44 20-50 38z" />
      <path d="M144 114c34-6 54 12 56 40-12-20-30-30-54-32z" />
      <path d="M142 116c14 26 12 56-6 80 6-26 4-50-6-74z" />
      <path d="M140 114c-26 8-46 32-50 62 10-24 28-42 54-52z" />
    </svg>
  );
}

/*
 * The GTA VI countdown (settings in lib/site.ts, gtaCountdown), in its own
 * Miami-sunset look: a pink-to-orange sky, a striped retro sun and palm
 * silhouettes, all drawn here. No Rockstar logo or art.
 *
 * The page is cached for up to 15 minutes, so the server only decides whether
 * the section shows at all; the numbers come from the visitor's clock once the
 * page loads (dashes until then, so the server and browser HTML match). The
 * digits just change each second, with no animation, so there's nothing to
 * switch off for reduced motion. role="timer" keeps screen readers from
 * announcing every tick.
 */
export function GtaCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current < launchAt) timer = setTimeout(tick, 1000 - (current % 1000));
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  if (now !== null && now >= hideAfter) return null;
  const launched = now !== null && now >= launchAt;

  return (
    <section
      aria-labelledby="gta-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#1a0b33_0%,#4a1460_32%,#b8327a_62%,#ff7a59_84%,#ffc06b_100%)]"
    >
      {/* Retro sun sinking into the horizon, cut by dark stripes. */}
      <div
        aria-hidden
        className="absolute bottom-[-14rem] left-1/2 -z-10 size-[28rem] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#ffe07a_0%,#ff9a4a_45%,#ff4f8b_100%)] [mask-image:repeating-linear-gradient(180deg,#000_0_22px,transparent_22px_30px)] lg:bottom-[-16rem] lg:left-[78%] lg:size-[36rem]"
      />
      {/* Water line. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-10 bg-[linear-gradient(180deg,#5b1d6e,#1a0b33)] lg:h-14" />
      <Palm className="absolute bottom-0 left-[-3.5rem] -z-10 h-64 text-[#14061f] lg:left-0 lg:h-[26rem]" />
      <Palm className="absolute right-[-3.5rem] bottom-0 -z-10 h-52 scale-x-[-1] text-[#14061f] lg:right-4 lg:h-[22rem]" />

      <div className="shell relative pt-12 pb-24 lg:pt-16 lg:pb-36">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <h2
              id="gta-title"
              className="font-display text-5xl leading-[0.86] font-black text-white uppercase italic [text-shadow:3px_3px_0_#ff3fb4,6px_6px_0_#2fe0ff] min-[400px]:text-6xl lg:text-8xl"
            >
              {launched ? "GTA VI is out" : "GTA VI countdown"}
            </h2>
            <p className="mt-4 max-w-xl text-lg font-semibold text-pretty text-white lg:text-xl">
              {launched
                ? "It's finally out on PS5 and Xbox Series X|S. Come hang out in Vice City on stream."
                : "Counting down to midnight Central on Nov 19. Coming to PS5 and Xbox Series X|S."}
            </p>
          </div>
          <NeonButton variant="outline" href={twitchChannel} external>
            Follow on Twitch
          </NeonButton>
        </div>

        {launched ? null : (
          <ol
            role="timer"
            aria-label="Time left until GTA VI unlocks"
            className="mt-8 grid max-w-4xl grid-cols-4 gap-2 sm:gap-4 lg:mt-12"
          >
            {split(now === null ? 0 : launchAt - now).map((unit) => (
              <li key={unit.label} className="chamfer bg-[#2fe0ff]/70 p-[2px] [--cut:14px]">
                <div className="chamfer flex flex-col items-center bg-[#1a0b33]/85 px-1 py-4 backdrop-blur-sm [--cut:13px] sm:py-6">
                  <span className="font-display text-5xl leading-none font-black text-white tabular-nums [text-shadow:0_0_2px_#fff,0_0_10px_#2fe0ff,0_0_22px_#ff3fb4] min-[400px]:text-6xl lg:text-8xl">
                    {now === null ? "--" : String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="mt-2 text-sm font-bold tracking-wide text-[#ffd9ef] uppercase lg:text-base">
                    {unit.label}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { NeonButton } from "@/components/neon-button";
import { SignHeading } from "@/components/sign-heading";
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
 * The GTA VI countdown (settings in lib/site.ts, gtaCountdown). The page is
 * cached for up to 15 minutes, so the server only decides whether the section
 * shows at all; the numbers come from the visitor's clock once the page loads
 * (dashes until then, so the server and browser HTML always match). The digits
 * just change each second: no animation, so nothing to switch off for reduced
 * motion. role="timer" keeps screen readers from announcing every tick.
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
      className="border-y border-neon-violet/20"
    >
      <div className="shell py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <SignHeading
            id="gta-title"
            tone="violet"
            size="md"
            sub={
              launched
                ? "It's finally out on PS5 and Xbox Series X|S. Come hang out in Vice City on stream."
                : "Counting down to midnight Central on Nov 19. Coming to PS5 and Xbox Series X|S."
            }
          >
            {launched ? "GTA VI is out" : "GTA VI countdown"}
          </SignHeading>
          <NeonButton variant="outline" href={twitchChannel} external>
            Follow on Twitch
          </NeonButton>
        </div>

        {launched ? null : (
          <ol
            role="timer"
            aria-label="Time left until GTA VI unlocks"
            className="mt-8 grid grid-cols-4 gap-2 sm:gap-4 lg:mt-10"
          >
            {split(now === null ? 0 : launchAt - now).map((unit) => (
              <li
                key={unit.label}
                className="chamfer relative bg-neon-violet/40 p-[2px] [--cut:14px]"
              >
                <div className="chamfer flex flex-col items-center bg-night-raised px-1 py-4 [--cut:13px] sm:py-6">
                  <span className="font-display neon-cyan text-5xl leading-none font-black tabular-nums min-[400px]:text-6xl lg:text-8xl">
                    {now === null ? "--" : String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="mt-2 text-sm font-bold tracking-wide text-haze uppercase lg:text-base">
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

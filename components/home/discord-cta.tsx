import { ArrowUpRightIcon, CheckIcon } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { DiscordMark } from "@/components/discord-mark";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import type { DiscordStats } from "@/lib/discord";

const perks = [
  "Stream pings the second we go live",
  "Squad up for tactical lobbies and Roblox nights",
  "Early looks at gear reviews and setup changes",
  "Recipe drops, giveaways, and general chaos",
];

/*
 * Deliberately loud: Discord blurple against the site's emerald/cyan palette
 * so this block reads as the community anchor rather than another card in the
 * grid. Counts come live from the invite endpoint — no API key needed.
 */
export function DiscordCta({ stats }: { stats: DiscordStats }) {
  return (
    <Section id="discord">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-[#5865F2]/35 bg-[#5865F2]/[0.07] p-8 backdrop-blur-md md:p-12">
          {/* Blurple bloom, plus a faint mark bleeding off the corner. */}
          <div
            aria-hidden
            className="animate-mesh pointer-events-none absolute -top-24 -right-16 size-96 rounded-full bg-[radial-gradient(circle,#5865F2,transparent_65%)] opacity-25 blur-3xl"
          />
          <Parallax
            distance={26}
            className="pointer-events-none absolute -bottom-12 -left-8"
          >
            <DiscordMark className="size-56 text-[#5865F2] opacity-[0.07]" />
          </Parallax>

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <span className="text-eyebrow inline-flex items-center gap-2 text-[#a5aeff]">
                <DiscordMark className="size-4" />
                {stats.name ?? "Discord community"}
              </span>

              <h2 className="text-display mt-4 text-3xl md:text-4xl lg:text-5xl">
                Come hang out in the Discord
              </h2>

              <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
                This is where the community actually lives — stream pings, squad
                finding, gear talk, and the kind of nonsense that doesn&apos;t make it
                into a video. Free to join, no gatekeeping.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={stats.inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-13 items-center gap-2.5 rounded-xl bg-[#5865F2] px-7 text-base font-semibold text-white shadow-[0_0_44px_-12px_#5865F2] transition-all hover:bg-[#4752c4] hover:shadow-[0_0_60px_-10px_#5865F2]"
                >
                  <DiscordMark className="size-5" />
                  Join the Discord
                  <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {stats.members !== null ? (
                  <p className="text-sm text-muted-foreground">
                    Join{" "}
                    <span className="font-semibold text-foreground">
                      <CountUp value={stats.members} format="plain" />
                    </span>{" "}
                    members already inside
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {stats.members !== null || stats.online !== null ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#5865F2]/25 bg-background/40 p-5">
                    <p className="text-display text-3xl md:text-4xl">
                      {stats.members !== null ? (
                        <CountUp value={stats.members} format="plain" />
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-eyebrow mt-2 text-muted-foreground">Members</p>
                  </div>

                  <div className="rounded-2xl border border-[#5865F2]/25 bg-background/40 p-5">
                    <p className="text-display inline-flex items-center gap-2 text-3xl md:text-4xl">
                      <span className="size-2.5 rounded-full bg-primary shadow-[0_0_10px_var(--glow-emerald)]" />
                      {stats.online !== null ? (
                        <CountUp value={stats.online} format="plain" />
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-eyebrow mt-2 text-muted-foreground">Online now</p>
                  </div>
                </div>
              ) : null}

              <ul className="space-y-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/20 text-[#a5aeff]">
                      <CheckIcon className="size-3" />
                    </span>
                    <span className="text-muted-foreground">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

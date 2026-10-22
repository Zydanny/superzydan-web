import { DiscordMark } from "@/components/discord-mark";
import { NeonButton } from "@/components/neon-button";
import type { DiscordStats } from "@/lib/discord";

// Fixed locale so the server and the browser print the same number.
const count = new Intl.NumberFormat("en-US");

/*
 * The closing sign on the home page: one big lit JOIN THE DISCORD, the live
 * member and online counts as lit counters, one button. Shares its look with
 * the Community page.
 */
export function DiscordCta({
  stats,
  headingLevel = "h2",
  line = "Stream pings the second we go live, squad-ups for Roblox and Minecraft nights, and the chaos that never makes the video.",
}: {
  stats: DiscordStats;
  headingLevel?: "h1" | "h2";
  line?: string;
}) {
  const Heading = headingLevel;

  return (
    <section aria-labelledby="discord-title" className="shell shell-y">
      <div className="chamfer bg-neon-cyan/70 p-[2px] [--cut:18px]">
        <div className="chamfer relative overflow-hidden bg-night-raised px-5 py-12 [--cut:17px] sm:px-10 lg:px-16 lg:py-16">
          {/* Light pooling up from the bottom edge, painted once. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_80%_at_50%_100%,rgb(47_224_255/0.18),transparent)]"
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div>
              <Heading
                id="discord-title"
                data-neon
                className="font-display neon-cyan text-[3.25rem] leading-[0.86] font-black text-balance uppercase min-[400px]:text-6xl lg:text-8xl"
              >
                Join the Discord
              </Heading>
              <p className="mt-5 max-w-lg text-lg text-pretty text-haze lg:text-xl">{line}</p>
              <NeonButton href={stats.inviteUrl} external className="mt-8">
                <DiscordMark className="size-5" />
                Join the Discord
              </NeonButton>
            </div>

            {stats.members !== null || stats.online !== null ? (
              <dl className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.members !== null ? <Counter label="members" value={stats.members} tone="magenta" /> : null}
                {stats.online !== null ? <Counter label="online now" value={stats.online} tone="cyan" live /> : null}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({
  label,
  value,
  tone,
  live = false,
}: {
  label: string;
  value: number;
  tone: "magenta" | "cyan";
  live?: boolean;
}) {
  return (
    <div className={`chamfer p-[2px] [--cut:12px] ${tone === "magenta" ? "bg-neon-magenta/60" : "bg-neon-cyan/60"}`}>
      <div className="chamfer flex h-full flex-col-reverse justify-end bg-night px-4 py-5 [--cut:11px] sm:px-6">
        <dt className="mt-2 flex items-center gap-2 text-sm font-bold tracking-wide text-haze uppercase">
          {live ? <span aria-hidden className="size-2 rounded-full bg-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]" /> : null}
          {label}
        </dt>
        <dd
          className={`font-display text-5xl leading-none font-black tabular-nums lg:text-6xl ${
            tone === "magenta" ? "neon-magenta" : "neon-cyan"
          }`}
        >
          {count.format(value)}
        </dd>
      </div>
    </div>
  );
}

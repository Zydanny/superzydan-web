import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { DiscordMark } from "@/components/discord-mark";
import { JsonLd } from "@/components/json-ld";
import { NeonButton } from "@/components/neon-button";
import { PageHero } from "@/components/page-hero";
import { SignHeading, TubeSign, type Tone } from "@/components/sign-heading";
import { getDiscordStats } from "@/lib/discord";
import { aboutPage } from "@/lib/pages";
import { absoluteUrl, PAGES, pageMetadata, PERSON_ID, personJsonLd } from "@/lib/seo";
import { discordInvite, socialStats } from "@/lib/site";
import { getTwitchStatus } from "@/lib/twitch";
import { getYouTubeSubscriberCount } from "@/lib/youtube";

export const metadata: Metadata = pageMetadata(PAGES.about);

export const revalidate = 1800;

const TONES: Tone[] = ["magenta", "cyan", "violet", "magenta"];

// Fixed locale so the server and the browser print the same "108K".
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export default async function AboutPage() {
  const [youtube, twitch, discord] = await Promise.all([
    getYouTubeSubscriberCount(),
    getTwitchStatus(),
    getDiscordStats(),
  ]);
  const fallback = (label: string) => socialStats.find((stat) => stat.label === label)?.value ?? null;

  const stats = [
    { label: "TikTok", where: "on TikTok", value: fallback("TikTok") },
    { label: "YouTube", where: "on YouTube", value: youtube ?? fallback("YouTube") },
    { label: "Instagram", where: "on Instagram", value: fallback("Instagram") },
    { label: "Twitch", where: "on Twitch", value: twitch.followers },
    { label: "Discord", where: "in the Discord", value: discord.members },
  ].filter((stat): stat is { label: string; where: string; value: number } => stat.value !== null);

  return (
    <main id="content" className="flex-1">
      <PageHero
        title="About"
        tone="magenta"
        description="A dad, his son, and way too many hobbies for one channel."
        aside={
          <div className="chamfer bg-neon-magenta/70 p-[2px] [--cut:16px]">
            <div className="chamfer relative aspect-[4/3] overflow-hidden bg-night-raised [--cut:15px]">
              {/* The same lit stage the home hero stands them on. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_100%,rgb(255_63_180/0.45),rgb(122_60_255/0.25)_45%,transparent_80%)]"
              />
              <Image
                src="/images/superzydan-linknova-cutout.webp"
                alt="SuperZydan and his son LinkNova standing back to back in matching black tees"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 36rem"
                className="object-cover object-[50%_10%]"
              />
            </div>
          </div>
        }
      />

      <section aria-label="The story" className="shell shell-y">
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-pretty text-haze lg:text-xl">
          {aboutPage.story.map((paragraph, index) => (
            <p key={index} className={index === 0 ? "text-xl text-white lg:text-2xl" : undefined}>
              {paragraph}
            </p>
          ))}
          {stats.length > 0 ? (
            // The numbers as one line of the story, not another row of stat cards.
            <p>
              These days that&apos;s{" "}
              {stats.map((stat, index) => (
                <span key={stat.label}>
                  {index > 0 ? (index === stats.length - 1 ? " and " : ", ") : null}
                  <strong className="font-bold text-white tabular-nums">{compact.format(stat.value)}</strong>{" "}
                  {stat.where}
                </span>
              ))}
              . Thanks for being part of it.
            </p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="story-title" className="border-y border-neon-violet/20">
        <div className="shell shell-y">
          <SignHeading id="story-title" tone="cyan" size="md">
            How it happened
          </SignHeading>
          <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {aboutPage.timeline.map((step, index) => (
              <li key={step.title}>
                <TubeSign as="p" tone={TONES[index]} className="text-lg lg:text-xl">
                  {step.when}
                </TubeSign>
                <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-pretty text-haze">{step.blurb}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="mix-title" className="shell shell-y">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SignHeading id="mix-title" tone="violet" size="md" sub="What a week in the Zyverse looks like.">
            The whole mix
          </SignHeading>
          <dl className="divide-y divide-neon-violet/20 border-y border-neon-violet/20">
            {aboutPage.pillars.map((pillar) => (
              <div key={pillar.title} className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-display text-2xl leading-none font-black tracking-wide text-neon-cyan uppercase">
                  {pillar.title}
                </dt>
                <dd className="text-pretty text-white">{pillar.blurb}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="crew-title" className="border-t border-neon-violet/20">
        <div className="shell shell-y grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SignHeading id="crew-title" tone="magenta" size="md" sub="The mods keeping chat in line.">
              The crew
            </SignHeading>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {aboutPage.team.map((person) => (
                <li key={person.name} className="chamfer bg-neon-violet/40 p-[2px] [--cut:12px]">
                  <div className="chamfer h-full bg-night-raised p-5 [--cut:11px]">
                    <p className="font-display text-2xl leading-none font-black tracking-wide uppercase">{person.name}</p>
                    <p className="mt-2 text-sm font-bold tracking-wide text-neon-cyan uppercase">{person.role}</p>
                    <p className="mt-3 text-pretty text-haze">{person.blurb}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Want to hang out?</h2>
              <p className="mt-2 text-pretty text-haze">The Discord is where the community actually lives.</p>
              <NeonButton href={discordInvite} external className="mt-5">
                <DiscordMark className="size-4" />
                Join the Discord
              </NeonButton>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Brand or creator?</h2>
              <p className="mt-2 text-pretty text-haze">Reach, audience and past collabs are all on one page.</p>
              <NeonButton href="/work-with-me" variant="outline" className="mt-5">
                Work with me
                <ArrowRightIcon className="size-4" />
              </NeonButton>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        nodes={[{ "@type": "ProfilePage", url: absoluteUrl(PAGES.about.path), mainEntity: { "@id": PERSON_ID } }, personJsonLd()]}
      />
    </main>
  );
}

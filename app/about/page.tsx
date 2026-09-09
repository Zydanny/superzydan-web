import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { ShimmerButton } from "@/components/shimmer-button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CountUp } from "@/components/count-up";
import { aboutPage } from "@/lib/pages";
import { heroStats } from "@/lib/site";
import { getDiscordStats } from "@/lib/discord";
import { getTwitchStatus } from "@/lib/twitch";
import { getYouTubeSubscriberCount } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "About Us",
  description: aboutPage.tagline,
};

export const revalidate = 1800;

export default async function AboutPage() {
  const [youtube, twitch, discord] = await Promise.all([
    getYouTubeSubscriberCount(),
    getTwitchStatus(),
    getDiscordStats(),
  ]);

  const stats = [
    { label: "YouTube", value: youtube ?? heroStats[0].value },
    { label: "TikTok", value: 108000 },
    { label: "Twitch", value: twitch.followers ?? 2652 },
    { label: "Instagram", value: 5421 },
    { label: "Discord", value: discord.members ?? 1118 },
  ];

  return (
    <main id="content" className="flex-1">
      <section className="shell shell-y">
        <div className="grid w-full items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,var(--glow-emerald),transparent_68%)] opacity-40 blur-3xl"
              />
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 shadow-2xl">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={aboutPage.image.src}
                    alt={aboutPage.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-[center_18%]"
                    priority
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="flex min-w-0 flex-col">
            <span className="text-eyebrow inline-flex items-center gap-2 text-primary">
              <span className="size-1 rounded-full bg-primary shadow-[0_0_8px_var(--glow-emerald)]" />
              {aboutPage.eyebrow}
            </span>
            <h1 className="text-display mt-4 text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {aboutPage.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-zinc-300 lg:text-xl">
              {aboutPage.tagline}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {aboutPage.badges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border border-zinc-800/80 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300"
                >
                  {badge}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-zinc-300 lg:text-xl">
              {aboutPage.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>
                Whether you’re here for gaming tips, a good laugh, or just to watch
                me burn virtual (and real) eggs — SuperZydan is real, unfiltered fun.
                No scripts, no fake hype. Subscribe, smash follow, and let’s get
                weird.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stats.slice(0, 3).map((stat) => (
                <SpotlightCard key={stat.label} className="p-4">
                  <p className="text-eyebrow text-muted-foreground">{stat.label}</p>
                  <p className="text-display mt-2 text-2xl tabular-nums lg:text-3xl">
                    <CountUp value={stat.value} format="compact" />
                  </p>
                </SpotlightCard>
              ))}
              {aboutPage.timeline.slice(0, 3).map((item) => (
                <SpotlightCard key={item.title} className="p-4">
                  <p className="text-eyebrow text-primary">{item.year}</p>
                  <h2 className="text-display mt-2 text-base lg:text-lg">{item.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                    {item.blurb}
                  </p>
                </SpotlightCard>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="The squad" title="Where the community lives" />
        <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <SpotlightCard className="p-6">
                <p className="text-eyebrow text-muted-foreground">{stat.label}</p>
                <p className="text-display mt-4 text-3xl tabular-nums">
                  <CountUp value={stat.value} format="compact" />
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section>
        <SectionHeading eyebrow="The story so far" title="How the Zyverse happened" />
        <StaggerGroup className="grid gap-4 md:grid-cols-2">
          {aboutPage.timeline.map((item) => (
            <StaggerItem key={item.title}>
              <SpotlightCard className="p-6">
                <p className="text-eyebrow text-primary">{item.year}</p>
                <h3 className="text-display mt-3 text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.blurb}
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section>
        <SectionHeading eyebrow="What you’ll find" title="The whole mix" />
        <StaggerGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {aboutPage.pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <SpotlightCard className="h-full p-6">
                <h3 className="text-display text-lg">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {pillar.blurb}
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section>
        <Reveal>
          <SpotlightCard className="p-8 md:p-10">
            <p className="text-eyebrow text-primary">Why it matters</p>
            <h2 className="text-display mt-3 text-3xl">{aboutPage.manifesto.title}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300 lg:text-xl">
              {aboutPage.manifesto.belief}
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {aboutPage.manifesto.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="mt-6 max-w-2xl leading-relaxed">{aboutPage.manifesto.closer}</p>
          </SpotlightCard>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading eyebrow="Mods" title="The people keeping chat sane" />
        <StaggerGroup className="grid gap-4 md:grid-cols-3">
          {aboutPage.team.map((person) => (
            <StaggerItem key={person.name}>
              <SpotlightCard className="h-full p-6">
                <h3 className="text-display text-lg">{person.name}</h3>
                <p className="text-eyebrow mt-2 text-primary">{person.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">{person.blurb}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section>
        <Reveal>
          <SpotlightCard className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-display text-2xl">Become a collaborator</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {aboutPage.collab}
              </p>
            </div>
            <ShimmerButton href="/contact">
              Contact us
            </ShimmerButton>
          </SpotlightCard>
        </Reveal>
      </Section>
    </main>
  );
}

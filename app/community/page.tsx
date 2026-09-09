import type { Metadata } from "next";
import { ArrowUpRightIcon } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { DiscordMark } from "@/components/discord-mark";
import { PageHero } from "@/components/page-hero";
import { DiscordWidget } from "@/components/pages/discord-widget";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { communityPage } from "@/lib/pages";
import { getDiscordStats } from "@/lib/discord";
import { discordInvite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community",
  description: communityPage.blurb,
};

export const revalidate = 900;

export default async function CommunityPage() {
  const stats = await getDiscordStats();

  return (
    <main id="content" className="flex-1">
      <div className="relative">
        <div
          aria-hidden
          className="animate-mesh pointer-events-none absolute top-0 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow-emerald),transparent_65%)] opacity-20 blur-3xl"
        />
        <PageHero
          eyebrow={communityPage.eyebrow}
          title={communityPage.title}
          description={communityPage.blurb}
        >
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-13 items-center gap-2.5 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[0_0_44px_-10px_var(--glow-emerald)] transition-all hover:shadow-[0_0_60px_-8px_var(--glow-emerald)]"
            >
              <DiscordMark className="size-5" />
              Join the Discord
              <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {stats.members !== null ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  <CountUp value={stats.members} format="plain" />
                </span>{" "}
                members already inside
                {stats.online !== null ? (
                  <>
                    {" · "}
                    <span className="font-semibold text-foreground">
                      <CountUp value={stats.online} format="plain" />
                    </span>{" "}
                    online now
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        </PageHero>
      </div>

      <Section>
        <SectionHeading
          align="center"
          eyebrow="Live chat"
          title="Server hub"
          description="A live look at #general. Jump into Discord if you want to talk — no extra accounts on this site."
        />
        <DiscordWidget />
      </Section>
    </main>
  );
}

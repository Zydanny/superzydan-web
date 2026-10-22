import type { Metadata } from "next";
import { DiscordCta } from "@/components/home/discord-cta";
import { PageHero } from "@/components/page-hero";
import { DiscordWidget } from "@/components/pages/discord-widget";
import { SignHeading } from "@/components/sign-heading";
import { getDiscordStats } from "@/lib/discord";
import { PAGES, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGES.community);

export const revalidate = 900;

export default async function CommunityPage() {
  const stats = await getDiscordStats();

  return (
    <main id="content" className="flex-1">
      <PageHero
        title="Community"
        tone="cyan"
        description="The Discord is the hangout: stream pings, squad-ups, gear talk and everything that never makes the video."
      />

      <DiscordCta
        stats={stats}
        line="Free to join. Get pinged the second we go live, find people to play with, and tell me which game to stream next."
      />

      <section aria-labelledby="chat-title" className="shell pb-14 lg:pb-24">
        <SignHeading id="chat-title" tone="violet" size="md" sub="What's going on in #general right now.">
          The chat
        </SignHeading>
        <div className="mt-8">
          <DiscordWidget />
        </div>
      </section>
    </main>
  );
}

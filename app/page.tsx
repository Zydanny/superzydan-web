import type { Metadata } from "next";
import { Collabs } from "@/components/home/collabs";
import { DeskTeaser } from "@/components/home/desk-teaser";
import { DiscordCta } from "@/components/home/discord-cta";
import { LatestPosts } from "@/components/home/latest-posts";
import { NeonHero } from "@/components/home/neon-hero";
import { Watch } from "@/components/home/watch";
import { ZyverseLanes } from "@/components/home/zyverse-lanes";
import { JsonLd } from "@/components/json-ld";
import { TwitchStatusProvider } from "@/components/twitch-status-provider";
import { getAllPosts } from "@/lib/blog";
import { getDiscordStats } from "@/lib/discord";
import { PAGES, pageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import { youtubeVideos } from "@/lib/site";
import { getTwitchClips, getTwitchStatus } from "@/lib/twitch";
import { getLatestChannelVideos, getYouTubeSubscriberCount } from "@/lib/youtube";

export const metadata: Metadata = pageMetadata(PAGES.home);

/*
 * Re-render every 15 min so YouTube uploads and the subscriber count stay
 * current. Next requires this to be a literal it can read statically, so
 * it cannot be imported from the lib files. Keep in sync with
 * YOUTUBE_REVALIDATE_SECONDS in lib/youtube.ts.
 *
 * Twitch live status is the exception: it needs to flip within a minute, so
 * the client polls /api/twitch/status instead of waiting for a revalidation.
 */
export const revalidate = 900;

export default async function Home() {
  const [liveVideos, subscriberCount, posts, twitchStatus, discordStats, twitchClips] = await Promise.all([
    getLatestChannelVideos(4),
    getYouTubeSubscriberCount(),
    getAllPosts(),
    getTwitchStatus(),
    getDiscordStats(),
    getTwitchClips(4),
  ]);

  const videos = liveVideos.length > 0 ? liveVideos : youtubeVideos.slice(0, 4);

  return (
    <TwitchStatusProvider initialStatus={twitchStatus}>
      <main id="content" className="flex-1">
        <NeonHero
          latestVideo={videos[0] ?? null}
          youtubeSubscribers={subscriberCount}
          discordMembers={discordStats.members}
        />
        <Watch videos={videos} clips={twitchClips} />
        <ZyverseLanes />
        <Collabs />
        <DeskTeaser />
        <LatestPosts posts={posts.slice(0, 3)} />
        <DiscordCta stats={discordStats} />
      </main>
      <JsonLd nodes={[personJsonLd(), websiteJsonLd()]} />
    </TwitchStatusProvider>
  );
}

import { AmazonStorefront } from "@/components/home/amazon-storefront";
import { DiscordCta } from "@/components/home/discord-cta";
import { GearReviews } from "@/components/home/gear-reviews";
import { NeonHero } from "@/components/home/neon-hero";
import { Partners } from "@/components/home/partners";
import { SocialStats } from "@/components/home/social-stats";
import { VlogFeed } from "@/components/home/vlog-feed";
import { Watch } from "@/components/home/watch";
import { TwitchStatusProvider } from "@/components/twitch-status-provider";
import { getDiscordStats } from "@/lib/discord";
import { youtubeVideos } from "@/lib/site";
import { getTwitchClips, getTwitchStatus } from "@/lib/twitch";
import { getVlogPosts } from "@/lib/blog";
import { getLatestChannelVideos, getYouTubeSubscriberCount } from "@/lib/youtube";

/*
 * Re-render every 15 min so YouTube uploads and the subscriber count stay
 * current. Next requires this to be a literal it can read statically, so
 * it cannot be imported from the lib files — keep in sync with
 * YOUTUBE_REVALIDATE_SECONDS in lib/youtube.ts.
 *
 * Twitch live status is the exception: it needs to flip within a minute, so
 * the client polls /api/twitch/status instead of waiting for a revalidation.
 */
export const revalidate = 900;

export default async function Home() {
  const [
    liveVideos,
    subscriberCount,
    posts,
    twitchStatus,
    discordStats,
    twitchClips,
  ] = await Promise.all([
    getLatestChannelVideos(4),
    getYouTubeSubscriberCount(),
    getVlogPosts(6),
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
        <DiscordCta stats={discordStats} />
        <SocialStats
          youtubeSubscribers={subscriberCount}
          twitchFollowers={twitchStatus.followers}
          discordMembers={discordStats.members}
        />
        <GearReviews />
        <AmazonStorefront />
        <VlogFeed posts={posts} />
        <Partners />
      </main>
    </TwitchStatusProvider>
  );
}

import { AmazonStorefront } from "@/components/home/amazon-storefront";
import { DiscordCta } from "@/components/home/discord-cta";
import { GearReviews } from "@/components/home/gear-reviews";
import { Hero } from "@/components/home/hero";
import { Partners } from "@/components/home/partners";
import { SocialStats } from "@/components/home/social-stats";
import { TwitchClips } from "@/components/home/twitch-clips";
import { TwitchLive } from "@/components/home/twitch-live";
import { VlogFeed } from "@/components/home/vlog-feed";
import { YoutubeGrid } from "@/components/home/youtube-grid";
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
    getLatestChannelVideos(5),
    getYouTubeSubscriberCount(),
    getVlogPosts(6),
    getTwitchStatus(),
    getDiscordStats(),
    getTwitchClips(4),
  ]);

  const videos = liveVideos.length > 0 ? liveVideos : youtubeVideos;
  // The hero already features the newest video, so the grid starts after it.
  const moreVideos = videos.slice(1, 5);

  return (
    <TwitchStatusProvider initialStatus={twitchStatus}>
      <main id="content" className="flex-1">
        <Hero
          youtubeSubscribers={subscriberCount}
          latestVideo={videos[0] ?? null}
        />
        <TwitchLive />
        <DiscordCta stats={discordStats} />
        <TwitchClips clips={twitchClips} />
        <YoutubeGrid
          videos={moreVideos}
          eyebrow="Latest"
          title="Newest from the channel"
          description="The most recent landscape upload — edited videos and live VODs — pulled from YouTube. Tap a card for a preview without leaving the page."
        />
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

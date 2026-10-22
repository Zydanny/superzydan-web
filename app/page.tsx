import type { Metadata } from "next";
import { Collabs } from "@/components/home/collabs";
import { DeskTeaser } from "@/components/home/desk-teaser";
import { DiscordCta } from "@/components/home/discord-cta";
import { FeaturedVideo } from "@/components/home/featured-video";
import { LatestPosts } from "@/components/home/latest-posts";
import { NeonHero } from "@/components/home/neon-hero";
import { Watch } from "@/components/home/watch";
import { ZyverseLanes } from "@/components/home/zyverse-lanes";
import { JsonLd } from "@/components/json-ld";
import { TwitchStatusProvider } from "@/components/twitch-status-provider";
import { getAllPosts } from "@/lib/blog";
import { getDiscordStats } from "@/lib/discord";
import { videoSummary } from "@/lib/post-seo";
import { PAGES, pageMetadata, personJsonLd, videoJsonLd, websiteJsonLd } from "@/lib/seo";
import { featuredVideo, youtubeVideos } from "@/lib/site";
import { getTwitchClips, getTwitchStatus } from "@/lib/twitch";
import { getLatestChannelVideos, getVideoDetails, getYouTubeSubscriberCount } from "@/lib/youtube";

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
  const [liveVideos, subscriberCount, posts, twitchStatus, discordStats, twitchClips, featuredDetails] = await Promise.all([
    getLatestChannelVideos(4),
    getYouTubeSubscriberCount(),
    getAllPosts(),
    getTwitchStatus(),
    getDiscordStats(),
    getTwitchClips(4),
    getVideoDetails([featuredVideo.id]),
  ]);

  const videos = liveVideos.length > 0 ? liveVideos : youtubeVideos.slice(0, 4);

  const featured = featuredDetails.get(featuredVideo.id);
  // The button only shows when its post really exists.
  const featuredPost = featuredVideo.post ? posts.find((post) => post.slug === featuredVideo.post?.slug) : undefined;
  const summary = featured ? videoSummary(featured.description) : "";

  return (
    <TwitchStatusProvider initialStatus={twitchStatus}>
      <main id="content" className="flex-1">
        <NeonHero
          latestVideo={videos[0] ?? null}
          youtubeSubscribers={subscriberCount}
          discordMembers={discordStats.members}
        />
        <Watch videos={videos} clips={twitchClips} />
        <FeaturedVideo
          title={featured?.title ?? featuredVideo.title}
          viewCount={featured?.viewCount}
          duration={featured?.duration}
          postHref={featuredPost ? `/lifestyle/${featuredPost.slug}` : null}
        />
        <ZyverseLanes />
        <Collabs />
        <DeskTeaser />
        <LatestPosts posts={posts.slice(0, 3)} />
        <DiscordCta stats={discordStats} />
      </main>
      <JsonLd
        nodes={[
          personJsonLd(),
          websiteJsonLd(),
          // Without the API there's no upload date, which Google requires, so the video is left out.
          ...(featured ? [videoJsonLd({ ...featured, description: summary.length >= 40 ? summary : featuredVideo.blurb })] : []),
        ]}
      />
    </TwitchStatusProvider>
  );
}

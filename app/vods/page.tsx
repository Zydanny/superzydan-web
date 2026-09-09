import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { YoutubeGrid } from "@/components/home/youtube-grid";
import { youtubeVideos } from "@/lib/site";
import { getLatestChannelVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "VODS",
  description: "Past streams and videos from the SuperZydan YouTube channel.",
};

export const revalidate = 900;

export default async function VodsPage() {
  const live = await getLatestChannelVideos(12);
  const videos = live.length > 0 ? live : youtubeVideos;

  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow="VODS"
        title="Catch up on the streams"
        description="Landscape uploads from the SuperZydan channel — Videos and Lives, newest first. Tap a card for a preview without leaving the page."
      />
      <YoutubeGrid
        videos={videos}
        eyebrow="Archive"
        title="Latest from YouTube"
        description="Pulled live from the channel feed. Shorts and portrait streams stay off this grid."
      />
    </main>
  );
}

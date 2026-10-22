import type { Metadata } from "next";
import { ArrowUpRightIcon } from "lucide-react";
import { NeonButton } from "@/components/neon-button";
import { PageHero } from "@/components/page-hero";
import { VodGrid } from "@/components/pages/vod-grid";
import { PAGES, pageMetadata } from "@/lib/seo";
import { twitchChannel, youtubeVideos } from "@/lib/site";
import { getLatestChannelVideos } from "@/lib/youtube";

export const metadata: Metadata = pageMetadata(PAGES.vods);

export const revalidate = 900;

export default async function VodsPage() {
  const live = await getLatestChannelVideos(24);
  const videos = live.length > 0 ? live : youtubeVideos;

  return (
    <main id="content" className="flex-1">
      <PageHero
        title="VODs"
        tone="magenta"
        description="Missed a stream? Here's everything from the main channel, newest first. Tap any screen to watch it right here."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <NeonButton href="https://www.youtube.com/@SuperZydan" external>
            YouTube channel
            <ArrowUpRightIcon className="size-4" />
          </NeonButton>
          <NeonButton href={twitchChannel} external variant="outline">
            Watch live on Twitch
            <ArrowUpRightIcon className="size-4" />
          </NeonButton>
        </div>
      </PageHero>

      <div className="shell shell-y">
        <VodGrid videos={videos} />
      </div>
    </main>
  );
}

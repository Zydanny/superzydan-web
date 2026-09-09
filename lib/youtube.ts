import type { VideoMeta } from "@/lib/site";

export const YOUTUBE_CHANNEL_ID = "UCdnz6bn82ihEWxpsbvWC80w";

const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

/** How long fetched YouTube data is cached before Next refetches it. */
export const YOUTUBE_REVALIDATE_SECONDS = 900;

function decodeXmlEntities(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

type FeedEntry = {
  id: string;
  title: string;
  publishedAt: string;
  link: string;
};

function parseFeed(xml: string): FeedEntry[] {
  return xml
    .split("<entry>")
    .slice(1)
    .flatMap((chunk) => {
      const id = /<yt:videoId>(.*?)<\/yt:videoId>/.exec(chunk)?.[1];
      const title = /<title>([\s\S]*?)<\/title>/.exec(chunk)?.[1];
      const publishedAt = /<published>(.*?)<\/published>/.exec(chunk)?.[1];
      const link =
        /<link rel="alternate" href="([^"]+)"/.exec(chunk)?.[1] ?? "";
      if (!id || !title || !publishedAt) return [];
      return [
        {
          id,
          title: decodeXmlEntities(title).trim(),
          publishedAt,
          link,
        },
      ];
    });
}

/*
 * Vertical clips are dropped from landscape grids. The channel marks portrait
 * streams with a "(Portrait)" suffix; Shorts use a /shorts/ URL in the feed.
 */
function isPortraitOrShort(entry: FeedEntry) {
  return /\(\s*portrait\s*\)/i.test(entry.title) || /\/shorts\//i.test(entry.link);
}

function isLiveVod(title: string) {
  return /\blive\b/i.test(title);
}

/** Strips the "🔴LIVE -" prefix so cards show just the stream topic. */
function cleanTitle(title: string) {
  return title
    .replace(/^[^\p{L}\p{N}]*live\s*[-–—:]*\s*/iu, "")
    .trim();
}

function toVideoMeta(entry: FeedEntry): VideoMeta {
  return {
    id: entry.id,
    title: cleanTitle(entry.title) || entry.title,
    tag: isLiveVod(entry.title) ? "Live VOD" : "Video",
  };
}

async function fetchChannelFeed(): Promise<FeedEntry[]> {
  const response = await fetch(FEED_URL, {
    next: { revalidate: YOUTUBE_REVALIDATE_SECONDS },
  });
  if (!response.ok) return [];
  return parseFeed(await response.text());
}

function uniqueByTitle(videos: VideoMeta[]) {
  const seen = new Set<string>();
  return videos.filter((video) => {
    const key = video.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/*
 * Newest landscape item from the channel RSS — regular Videos tab uploads and
 * Live VODs, skipping Shorts and portrait streams. The feed is already newest
 * first. Falls back to [] so callers can use the static list in lib/site.ts.
 */
export async function getLatestChannelVideos(limit = 12): Promise<VideoMeta[]> {
  try {
    const candidates = (await fetchChannelFeed())
      .filter((entry) => !isPortraitOrShort(entry))
      .map(toVideoMeta);

    return uniqueByTitle(candidates).slice(0, limit);
  } catch {
    return [];
  }
}

/*
 * Live-tab VODs only. Kept for stream-focused surfaces; the homepage hero uses
 * getLatestChannelVideos so a new edited upload can outrank a recent stream.
 */
export async function getLatestStreamVods(limit = 4): Promise<VideoMeta[]> {
  try {
    const candidates = (await fetchChannelFeed())
      .filter((entry) => !isPortraitOrShort(entry) && isLiveVod(entry.title))
      .map(toVideoMeta);

    return uniqueByTitle(candidates).slice(0, limit);
  } catch {
    return [];
  }
}

/*
 * Live subscriber count. Requires YOUTUBE_API_KEY; returns null when the key is
 * absent or the request fails so callers can fall back to the static number.
 * Note that YouTube itself rounds public counts to three significant figures.
 */
export async function getYouTubeSubscriberCount(): Promise<number | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${key}`,
      { next: { revalidate: YOUTUBE_REVALIDATE_SECONDS } },
    );
    if (!response.ok) return null;

    const data = await response.json();
    const raw = data?.items?.[0]?.statistics?.subscriberCount;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

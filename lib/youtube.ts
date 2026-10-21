import { withAssociateTag } from "@/lib/affiliate";
import { REVIEWS_YOUTUBE_CHANNEL_ID, type VideoMeta } from "@/lib/site";

export const YOUTUBE_CHANNEL_ID = "UCdnz6bn82ihEWxpsbvWC80w";

const API = "https://www.googleapis.com/youtube/v3";

function feedUrl(channelId: string) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

/** How long fetched YouTube data is cached before Next refetches it. */
export const YOUTUBE_REVALIDATE_SECONDS = 900;

/*
 * The API doesn't flag Shorts. A Short is vertical and three minutes at most,
 * and the player part's embed size gives the aspect ratio.
 */
const SHORT_MAX_SECONDS = 180;

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
  /** A /shorts/ URL for Shorts, /watch otherwise. */
  link: string;
  /** Only from the API. */
  description?: string;
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
 * streams with a "(Portrait)" suffix; Shorts use a /shorts/ URL.
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

/** "PT7M43S" to 463. */
function durationSeconds(iso: string) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const [, h = "0", m = "0", s = "0"] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

async function fetchJson(url: string) {
  const response = await fetch(url, { next: { revalidate: YOUTUBE_REVALIDATE_SECONDS } });
  return response.ok ? response.json() : null;
}

type ApiVideo = {
  id: string;
  snippet?: { title?: string; description?: string; publishedAt?: string; liveBroadcastContent?: string };
  contentDetails?: { duration?: string };
  player?: { embedWidth?: string | number; embedHeight?: string | number };
};

/*
 * Newest uploads from the Data API: the uploads playlist (a channel ID with UC
 * swapped for UU), then video details for length, shape and description. About
 * two quota units per 50 videos. Null without a key or when the API fails.
 */
async function fetchUploadsFromApi(channelId: string, max: number): Promise<FeedEntry[] | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  const playlistId = `UU${channelId.slice(2)}`;
  const ids: string[] = [];
  let pageToken = "";
  do {
    const page = await fetchJson(
      `${API}/playlistItems?part=contentDetails&maxResults=${Math.min(50, max)}&playlistId=${playlistId}&key=${key}${pageToken ? `&pageToken=${pageToken}` : ""}`,
    );
    if (!page) return null;
    for (const item of page.items ?? []) {
      if (item?.contentDetails?.videoId) ids.push(item.contentDetails.videoId);
    }
    pageToken = page.nextPageToken ?? "";
  } while (pageToken && ids.length < max);

  const entries: FeedEntry[] = [];
  const wanted = ids.slice(0, max);
  for (let i = 0; i < wanted.length; i += 50) {
    const batch = await fetchJson(
      `${API}/videos?part=snippet,contentDetails,player&maxHeight=1000&id=${wanted.slice(i, i + 50).join(",")}&key=${key}`,
    );
    if (!batch) return null;
    for (const video of (batch.items ?? []) as ApiVideo[]) {
      const { title, description, publishedAt, liveBroadcastContent } = video.snippet ?? {};
      // Live and upcoming streams sit in the uploads playlist too, with no length yet.
      if (!title || !publishedAt || (liveBroadcastContent && liveBroadcastContent !== "none")) continue;
      const vertical = Number(video.player?.embedHeight) > Number(video.player?.embedWidth);
      const short = vertical && durationSeconds(video.contentDetails?.duration ?? "") <= SHORT_MAX_SECONDS;
      entries.push({
        id: video.id,
        title: title.trim(),
        publishedAt,
        link: short ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`,
        description: description ?? "",
      });
    }
  }

  return entries.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/* The API when YOUTUBE_API_KEY is set, since YouTube's RSS feeds go down for days at a time; RSS otherwise. */
async function fetchChannelFeed(channelId = YOUTUBE_CHANNEL_ID, max = 50): Promise<FeedEntry[]> {
  const fromApi = await fetchUploadsFromApi(channelId, max);
  if (fromApi) return fromApi;

  const response = await fetch(feedUrl(channelId), {
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
 * Newest landscape items from the channel: regular uploads and Live VODs,
 * skipping Shorts and portrait streams, newest first. Falls back to [] so
 * callers can use the static list in lib/site.ts.
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

export type ChannelUpload = {
  id: string;
  title: string;
  /** YYYY-MM-DD. */
  date: string;
  short: boolean;
  /** The first product link in the description, if there is one. */
  productUrl?: string;
};

const PRODUCT_LINK =
  /https?:\/\/(?:www\.)?(?:amazon\.com\/(?!shop\/)|amzn\.to\/|geni\.us\/|urlgeni\.us\/|link\.amazon\/|a\.co\/)[^\s)]+/i;

/* Every upload on the reviews channel, newest first. [] when unreachable. */
export async function getReviewsChannelUploads(): Promise<ChannelUpload[]> {
  try {
    return (await fetchChannelFeed(REVIEWS_YOUTUBE_CHANNEL_ID, 500)).map((entry) => {
      const productUrl = entry.description ? PRODUCT_LINK.exec(entry.description)?.[0] : undefined;
      return {
        id: entry.id,
        title: entry.title,
        date: entry.publishedAt.slice(0, 10),
        short: /\/shorts\//.test(entry.link),
        ...(productUrl ? { productUrl: withAssociateTag(productUrl) } : {}),
      };
    });
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

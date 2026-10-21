import { twitchUsername } from "@/lib/site";

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const HELIX = "https://api.twitch.tv/helix";

/** Most recent past broadcast, used to fill the offline state. */
export type TwitchVod = {
  title: string;
  url: string;
  thumbnail: string | null;
  duration: string | null;
  views: number | null;
  createdAt: string;
};

export type TwitchStatus = {
  /**
   * False when TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET are missing or the API
   * is unreachable. The UI then shows a neutral "check the channel" state
   * rather than claiming the stream is live or offline.
   */
  configured: boolean;
  isLive: boolean;
  title: string | null;
  game: string | null;
  viewers: number | null;
  startedAt: string | null;
  followers: number | null;
  /** Category from the channel page — what was played last when offline. */
  lastGame: string | null;
  lastStream: TwitchVod | null;
};

export type TwitchClip = {
  id: string;
  title: string;
  url: string;
  thumbnail: string | null;
  views: number;
  duration: number;
};

export const OFFLINE_UNKNOWN: TwitchStatus = {
  configured: false,
  isLive: false,
  title: null,
  game: null,
  viewers: null,
  startedAt: null,
  followers: null,
  lastGame: null,
  lastStream: null,
};

/**
 * How the Helix reads participate in Next's data cache.
 *
 * `no-store` anywhere in a render forces the whole route to be dynamic, so the
 * homepage passes a revalidate window instead and lets the client poller in
 * <TwitchStatusProvider> supply second-to-second accuracy. Only the polled API
 * route, which is dynamic by design, reads uncached.
 */
export type TwitchCacheMode = "no-store" | { revalidate: number };

function cacheInit(mode: TwitchCacheMode): RequestInit {
  return mode === "no-store"
    ? { cache: "no-store" }
    : { next: { revalidate: mode.revalidate } };
}

/** Cheap default for server renders: fresh enough, still statically cacheable. */
export const TWITCH_RENDER_CACHE: TwitchCacheMode = { revalidate: 60 };

/*
 * App access tokens last ~60 days, so cache in module scope and refresh a
 * minute before expiry instead of re-authenticating on every request.
 */
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAppToken(): Promise<string | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  /*
   * Not marked no-store: Next never caches POSTs anyway, and the explicit flag
   * would drag the calling route into dynamic rendering. The module-scope cache
   * above is what actually prevents repeat authentication.
   */
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });
  if (!response.ok) return null;

  const json: { access_token?: string; expires_in?: number } =
    await response.json();
  if (!json.access_token) return null;

  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return tokenCache.token;
}

function helix(path: string, token: string, mode: TwitchCacheMode) {
  return fetch(`${HELIX}${path}`, {
    headers: {
      "Client-Id": process.env.TWITCH_CLIENT_ID ?? "",
      Authorization: `Bearer ${token}`,
    },
    ...cacheInit(mode),
  });
}

/* The broadcaster id never changes, so resolve the login name only once. */
let broadcasterId: string | null = null;

async function getBroadcasterId(token: string): Promise<string | null> {
  if (broadcasterId) return broadcasterId;

  const response = await helix(`/users?login=${twitchUsername}`, token, {
    revalidate: 86_400,
  });
  if (!response.ok) return null;

  const json: { data?: { id?: string }[] } = await response.json();
  broadcasterId = json.data?.[0]?.id ?? null;
  return broadcasterId;
}

/** Strips the "🔴LIVE -" prefix the channel puts on every broadcast title. */
function cleanTitle(title: string) {
  return title.replace(/^[^\p{L}\p{N}]*live\s*[-–—:]*\s*/iu, "").trim();
}

/*
 * Twitch returns thumbnails with %{width}/%{height} placeholders, and serves a
 * vod-secure.twitch.tv/_404 URL while a recording is still processing. Only
 * the real CDN host is allowlisted in next.config.ts, so anything else becomes
 * null and the card falls back to a plain tile.
 */
function vodThumbnail(raw: string | undefined): string | null {
  if (!raw) return null;
  const url = raw.replace("%{width}", "640").replace("%{height}", "360");
  return url.startsWith("https://static-cdn.jtvnw.net/") ? url : null;
}

function clipThumbnail(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.hostname === "static-cdn.jtvnw.net" ||
      url.hostname.endsWith(".twitch.tv")
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/*
 * Twitch caps a single recording at 48 hours, so anything longer is bad data
 * rather than a real stream. Hide it instead of showing something like
 * "2195h 43m".
 */
const MAX_VOD_HOURS = 48;

/** "4h33m16s" reads better as "4h 33m"; seconds are noise at this size. */
function formatDuration(raw: string | undefined): string | null {
  if (!raw) return null;
  const match = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(raw);
  if (!match) return null;

  const [, days, hoursPart, minutes, seconds] = match;
  const hours = Number(days ?? 0) * 24 + Number(hoursPart ?? 0);
  if (hours > MAX_VOD_HOURS) return null;

  if (hours) return `${hours}h ${minutes ?? 0}m`;
  if (minutes) return `${minutes}m`;
  return seconds ? `${seconds}s` : null;
}

/*
 * An app access token is enough for all of these: /streams, /channels and
 * /videos are public, and /channels/followers returns the `total` field
 * without a user scope (only the follower *list* needs moderator:read:followers).
 */
export async function getTwitchStatus(
  mode: TwitchCacheMode = TWITCH_RENDER_CACHE,
): Promise<TwitchStatus> {
  try {
    const token = await getAppToken();
    if (!token) return OFFLINE_UNKNOWN;

    const id = await getBroadcasterId(token);
    if (!id) return OFFLINE_UNKNOWN;

    // Followers and the VOD list move slowly; only live status needs to be hot.
    const slow: TwitchCacheMode = mode === "no-store" ? "no-store" : { revalidate: 900 };

    const [streamRes, followerRes, channelRes, vodRes] = await Promise.all([
      helix(`/streams?user_id=${id}`, token, mode),
      helix(`/channels/followers?broadcaster_id=${id}&first=1`, token, slow),
      helix(`/channels?broadcaster_id=${id}`, token, slow),
      helix(`/videos?user_id=${id}&type=archive&first=1`, token, slow),
    ]);

    if (!streamRes.ok) return OFFLINE_UNKNOWN;

    const streamJson: {
      data?: {
        title?: string;
        game_name?: string;
        viewer_count?: number;
        started_at?: string;
      }[];
    } = await streamRes.json();
    const stream = streamJson.data?.[0];

    let followers: number | null = null;
    if (followerRes.ok) {
      const followerJson: { total?: number } = await followerRes.json();
      followers = typeof followerJson.total === "number" ? followerJson.total : null;
    }

    let lastGame: string | null = null;
    if (channelRes.ok) {
      const channelJson: { data?: { game_name?: string }[] } = await channelRes.json();
      lastGame = channelJson.data?.[0]?.game_name || null;
    }

    let lastStream: TwitchVod | null = null;
    if (vodRes.ok) {
      const vodJson: {
        data?: {
          title?: string;
          url?: string;
          thumbnail_url?: string;
          duration?: string;
          view_count?: number;
          created_at?: string;
        }[];
      } = await vodRes.json();

      const vod = vodJson.data?.[0];
      if (vod?.url && vod.created_at) {
        lastStream = {
          title: cleanTitle(vod.title ?? "") || (vod.title ?? "Past broadcast"),
          url: vod.url,
          thumbnail: vodThumbnail(vod.thumbnail_url),
          duration: formatDuration(vod.duration),
          views: vod.view_count ?? null,
          createdAt: vod.created_at,
        };
      }
    }

    return {
      configured: true,
      isLive: Boolean(stream),
      title: stream?.title ? cleanTitle(stream.title) || stream.title : null,
      game: stream?.game_name ?? null,
      viewers: stream?.viewer_count ?? null,
      startedAt: stream?.started_at ?? null,
      followers,
      lastGame,
      lastStream,
    };
  } catch {
    return OFFLINE_UNKNOWN;
  }
}

const HIDDEN_CLIP_IDS = new Set([
  "CoyArtisticPuffinPanicVis-OlnPji7IpJ_cR-o-",
]);

function isHiddenClip(id: string, title: string) {
  if (HIDDEN_CLIP_IDS.has(id)) return true;
  return /blind playthrough/i.test(title);
}

export async function getTwitchClips(
  limit = 4,
  mode: TwitchCacheMode = { revalidate: 1800 },
): Promise<TwitchClip[]> {
  try {
    const token = await getAppToken();
    if (!token) return [];

    const id = await getBroadcasterId(token);
    if (!id) return [];

    const response = await helix(
      `/clips?broadcaster_id=${id}&first=${Math.min(limit + 4, 20)}`,
      token,
      mode,
    );
    if (!response.ok) return [];

    const json: {
      data?: {
        id?: string;
        title?: string;
        url?: string;
        thumbnail_url?: string;
        view_count?: number;
        duration?: number;
      }[];
    } = await response.json();

    return (json.data ?? [])
      .flatMap((clip) => {
        const title = clip.title?.trim() ?? "";
        if (!clip.id || !clip.url || title.length < 4) return [];
        if (isHiddenClip(clip.id, title)) return [];
        return [
          {
            id: clip.id,
            title,
            url: clip.url,
            thumbnail: clipThumbnail(clip.thumbnail_url),
            views: clip.view_count ?? 0,
            duration: clip.duration ?? 0,
          },
        ];
      })
      .slice(0, limit);
  } catch {
    return [];
  }
}

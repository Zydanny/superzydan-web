import type { VlogPost } from "@/lib/site";

const WP_BASE = "https://superzydanofficial.com";
const POSTS_URL = `${WP_BASE}/wp-json/wp/v2/posts?per_page=12&_embed=1`;

export const WORDPRESS_REVALIDATE_SECONDS = 1800;

const WORDS_PER_MINUTE = 200;

function decodeEntities(value: string) {
  return value
    .replace(/&#8217;|&#8216;|&apos;|&#39;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&hellip;|&#8230;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&");
}

function stripHtml(value: string) {
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(html: string) {
  const text = stripHtml(html);
  return text ? text.split(" ").length : 0;
}

/*
 * Only accept real media-library images. Requiring the /wp-content/uploads/
 * prefix keeps this in lockstep with the remotePatterns allowlist in
 * next.config.ts, and rejects junk like the literal
 * "your-thumbnail-image-url.jpg" placeholder still sitting in the body of one
 * published post, which would otherwise resolve against the site root.
 */
const UPLOADS_PREFIX = "/wp-content/uploads/";

function normalizeImageUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw, WP_BASE);
    if (url.hostname !== "superzydanofficial.com") return null;
    if (!url.pathname.startsWith(UPLOADS_PREFIX)) return null;
    if (!/\.(png|jpe?g|webp|gif|avif)$/i.test(url.pathname)) return null;
    url.protocol = "https:"; // several posts still link http, which browsers block
    return url.toString();
  } catch {
    return null;
  }
}

type WpPost = {
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  link?: string;
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string }[];
    "wp:term"?: { name?: string; taxonomy?: string }[][];
  };
};

/*
 * Several posts are written around a video and have no uploaded image at all
 * ("Stop Losing Amazon Commissions!", "Who's the Jedi Master?"). Those embed a
 * YouTube video, so its thumbnail is the post's real artwork.
 */
const YOUTUBE_ID =
  /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;

/*
 * maxresdefault is 16:9 and sharp but only exists for videos uploaded with a
 * HD thumbnail, so probe it and fall back to mqdefault, which is always
 * present and also 16:9 (hqdefault would add letterbox bars).
 */
async function youtubeThumbnail(html: string): Promise<string | null> {
  const id = YOUTUBE_ID.exec(html)?.[1];
  if (!id) return null;

  const maxRes = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  try {
    const probe = await fetch(maxRes, {
      method: "HEAD",
      next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
    });
    if (probe.ok) return maxRes;
  } catch {
    /* Fall through to the guaranteed size. */
  }

  return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}

/*
 * Priority: the WordPress featured image, then the first real in-body upload,
 * then the embedded video's thumbnail. Setting a featured image in WordPress
 * always wins, so posts can be corrected from the CMS without a code change.
 */
async function pickThumbnail(post: WpPost): Promise<string | null> {
  const featured = normalizeImageUrl(
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  );
  if (featured) return featured;

  const html = post.content?.rendered ?? "";

  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  const inBody = normalizeImageUrl(match?.[1]);
  if (inBody) return inBody;

  return youtubeThumbnail(html);
}

/* First real category, ignoring WordPress's "Uncategorized" default. */
function pickTag(post: WpPost): string {
  const categories = (post._embedded?.["wp:term"]?.[0] ?? [])
    .map((term) => decodeEntities(term?.name ?? "").trim())
    .filter((name) => name && name.toLowerCase() !== "uncategorized");

  return categories[0] ?? "Vlog";
}

function truncate(value: string, max = 160) {
  if (value.length <= max) return value;
  return `${value.slice(0, value.lastIndexOf(" ", max))}…`;
}

/*
 * Latest posts from the live WordPress site. Returns an empty array on any
 * failure so the caller can fall back to the static list in lib/site.ts.
 */
export async function getVlogPosts(limit = 6): Promise<VlogPost[]> {
  try {
    const response = await fetch(POSTS_URL, {
      next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
    });
    if (!response.ok) return [];

    const posts: WpPost[] = await response.json();

    return await Promise.all(
      posts.slice(0, limit).map(async (post) => {
        const words = countWords(post.content?.rendered ?? "");
        return {
          title: decodeEntities(post.title?.rendered ?? "Untitled"),
          excerpt: truncate(stripHtml(post.excerpt?.rendered ?? "")),
          tag: pickTag(post),
          readTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
          status: "Published",
          thumbnail: await pickThumbnail(post),
          url: post.link ?? WP_BASE,
        };
      }),
    );
  } catch {
    return [];
  }
}

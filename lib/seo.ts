import type { Metadata } from "next";
import { reviewsChannelUrl, twitchChannel } from "@/lib/site";

/*
 * Search basics in one place: the canonical host, each page's search title and
 * snippet, and the JSON-LD builders. Titles here are whole titles (the root
 * layout's "%s | SuperZydan" template is bypassed) so each one can be checked
 * against the 60-character limit as written.
 */
export const SITE_URL = "https://www.superzydanofficial.com";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

/* Social profiles for Person.sameAs. X is left out on purpose for now. */
export const PROFILE_URLS = [
  "https://www.youtube.com/@SuperZydan",
  reviewsChannelUrl,
  "https://www.tiktok.com/@superzydan",
  "https://www.instagram.com/superzydan/",
  twitchChannel,
  "https://www.facebook.com/superzydanofficial",
];

export const facebookUrl = "https://www.facebook.com/superzydanofficial";

type PageSeo = {
  path: string;
  title: string;
  description: string;
  /** YYYY-MM-DD of the page's last real change, for the sitemap. */
  updated: string;
};

export const PAGES = {
  home: {
    path: "/",
    title: "SuperZydan: Dad and Son Gaming, Streams and Gear Reviews",
    description:
      "SuperZydan and his son LinkNova play Roblox, Minecraft and Switch co-op. Plus solo night streams on Twitch, honest gear reviews and recipes.",
    updated: "2026-10-21",
  },
  about: {
    path: "/about",
    title: "About SuperZydan: The Gamer Dad Behind the Zyverse",
    description:
      "Who SuperZydan is: a gamer dad who streams with his son LinkNova, reviews gear and cooks. How the Zyverse started and who keeps chat in line.",
    updated: "2026-10-21",
  },
  lifestyle: {
    path: "/lifestyle",
    title: "SuperZydan Blog: Recipes, Gaming and Family Fun",
    description:
      "Recipes, family game nights, Roblox events and the stuff we can't stop talking about, newest first. Gear reviews have their own page.",
    updated: "2026-10-21",
  },
  vods: {
    path: "/vods",
    title: "SuperZydan Stream VODs and Videos",
    description:
      "Missed a stream? Catch the newest SuperZydan videos and stream replays: co-op with LinkNova, night streams and gear unboxings.",
    updated: "2026-10-21",
  },
  productReviews: {
    path: "/product-reviews",
    title: "Honest Product Reviews by SuperZydan: Gear, Kitchen, Home",
    description:
      "Video reviews of keyboards, controllers, creator gear, kitchen tools, fitness gear and more. What I actually think, pros and cons, and where to get it.",
    updated: "2026-10-21",
  },
  setup: {
    path: "/setup",
    title: "SuperZydan's Stream Setup: RTX 4090 PC, Camera and Gear",
    description:
      "Every piece of my stream desk: the i9-13900K and RTX 4090 PC, the FNP75 HE Hall Effect keyboard, a Sony a6000 camera, Elgato gear and mics.",
    updated: "2026-10-21",
  },
  community: {
    path: "/community",
    title: "Join the SuperZydan Discord Community",
    description:
      "Stream pings, squad-ups for Roblox and Minecraft nights, gear talk and general chaos. Over 1,000 people already hang out in the SuperZydan Discord.",
    updated: "2026-10-21",
  },
  contact: {
    path: "/contact",
    title: "Contact SuperZydan: Questions, Fan Mail and Business",
    description:
      "Send SuperZydan a message. Questions, fan mail and collab ideas all land in the same inbox. Brands, the Work With Me page has the details.",
    updated: "2026-10-21",
  },
  workWithMe: {
    path: "/work-with-me",
    title: "Work With SuperZydan: UGC, Sponsored Reviews and Collabs",
    description:
      "Partner with SuperZydan: 108K TikTok followers, a father-son gaming channel and honest gear reviews. UGC, sponsored reviews and sponsorships.",
    updated: "2026-10-21",
  },
  privacy: {
    path: "/privacy-policy",
    title: "Privacy Policy | SuperZydan",
    description:
      "How superzydanofficial.com handles your data: analytics, embedded videos and chat, affiliate links and how to reach us with questions.",
    updated: "2026-10-21",
  },
} satisfies Record<string, PageSeo>;

/*
 * Metadata for a page: whole title, snippet, canonical URL and the matching
 * Open Graph / Twitter fields (Next doesn't copy title and description into
 * those once a page sets its own openGraph object).
 */
export function seoMetadata({
  path,
  title,
  description,
  image,
  type = "website",
  noindex = false,
}: {
  path: string;
  title: string;
  description: string;
  image?: { url: string; alt: string } | null;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const images = image ? [image] : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName: "SuperZydan",
      locale: "en_US",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((entry) => entry.url) } : {}),
    },
  };
}

export function pageMetadata(page: PageSeo, extra: Partial<Parameters<typeof seoMetadata>[0]> = {}): Metadata {
  return seoMetadata({ path: page.path, title: page.title, description: page.description, ...extra });
}

/* ---------- JSON-LD ---------- */

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/* A reference to the one Person node, for author and publisher fields. */
export const personRef = { "@type": "Person", "@id": PERSON_ID, name: "SuperZydan", url: SITE_URL } as const;

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "SuperZydan",
    url: SITE_URL,
    image: absoluteUrl("/brand/sz-logo.webp"),
    description:
      "Gamer dad and creator. Father-son co-op streams with his son LinkNova, solo night streams, gear reviews and cooking.",
    sameAs: PROFILE_URLS,
    worksFor: { "@type": "Organization", name: "SuperZydan LLC", url: SITE_URL },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "SuperZydan",
    description: PAGES.home.description,
    inLanguage: "en-US",
    publisher: { "@id": PERSON_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type VideoDetails = {
  id: string;
  title: string;
  description: string;
  /** Full ISO timestamp from YouTube. */
  uploadDate: string;
  /** ISO 8601 duration like PT7M43S. */
  duration?: string;
  viewCount?: number;
};

export function videoJsonLd(video: VideoDetails) {
  return {
    "@type": "VideoObject",
    name: video.title,
    // Google wants a description; fall back to the title rather than leave it empty.
    description: video.description.trim().slice(0, 2000) || video.title,
    thumbnailUrl: [
      `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    ],
    uploadDate: video.uploadDate,
    ...(video.duration ? { duration: video.duration } : {}),
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
    ...(video.viewCount !== undefined
      ? {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: { "@type": "WatchAction" },
            userInteractionCount: video.viewCount,
          },
        }
      : {}),
    author: personRef,
  };
}

/* Wraps nodes in one @graph so they can reference each other by @id. */
export function jsonLdGraph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/* Escapes "<" so a title can never close the script tag early. */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

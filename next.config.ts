import type { NextConfig } from "next";

/*
 * Posts from the old WordPress site, which used /<slug>/ permalinks. They now
 * live at /lifestyle/<slug>; these keep old links and search results working.
 * Next strips the trailing slash before redirects run, so /<slug>/ matches too.
 */
const legacyPostSlugs = [
  "anker165-powerbank",
  "backtoschool2025",
  "budget-irl-streaming-setup",
  "creamy-korean-carbonara",
  "dyson-v11",
  "emeet-nova-4k-webcam-upgrade",
  "gamesir-cyclone2",
  "gamestop-trade-in",
  "grow-a-garden-chris-p-bacon-cooking-event",
  "hollylandlarkm2",
  "hyperx-cloud-headset",
  "kitchen-fail-redemption",
  "need-vs-want-episode-1",
  "stop-losing-amazon-commissions",
  "sweatandprogress",
  "urevo-smart-walking-pad",
  "whos-the-jedi-master",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        // Twitch past-broadcast thumbnails.
        protocol: "https",
        hostname: "static-cdn.jtvnw.net",
        pathname: "/cf_vods/**",
      },
      {
        // Twitch clip thumbnails.
        protocol: "https",
        hostname: "static-cdn.jtvnw.net",
        pathname: "/twitch-video-assets/**",
      },
    ],
  },
  /*
   * These pages read the post files at runtime: /lifestyle and /product-reviews
   * render per request (they read ?tag= and ?category=), and the home page
   * regenerates every 15 minutes. Post pages are prerendered and don't need this.
   */
  outputFileTracingIncludes: {
    "/": ["./content/blog/**/*"],
    "/lifestyle": ["./content/blog/**/*"],
    "/product-reviews": ["./content/blog/**/*"],
  },
  async redirects() {
    return legacyPostSlugs.map((slug) => ({
      source: `/${slug}`,
      destination: `/lifestyle/${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;

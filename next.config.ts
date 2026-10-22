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
   * Pages that regenerate on the server (they refresh live YouTube, Twitch or
   * Discord data) read the post files again when they do, so the files have
   * to ship with them. Fully static pages read them at build time only.
   */
  outputFileTracingIncludes: {
    /*
     * Hostinger builds with output: "standalone", which copies only traced
     * files. The tracer's sharp rule still looks for sharp/lib/index.js, gone
     * since sharp 0.35, so the native image libraries get left behind and image
     * optimization quietly turns off. Ship sharp's platform packages whole.
     */
    "/*": ["./node_modules/@img/**/*"],
    "/": ["./content/blog/**/*"],
    "/lifestyle/[slug]": ["./content/blog/**/*"],
    "/product-reviews": ["./content/blog/**/*"],
    "/work-with-me": ["./content/blog/**/*"],
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

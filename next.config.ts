import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        // Blog thumbnails pulled from the WordPress media library.
        protocol: "https",
        hostname: "superzydanofficial.com",
        pathname: "/wp-content/uploads/**",
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
};

export default nextConfig;

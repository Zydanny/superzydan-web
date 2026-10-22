import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/*
 * The same rules on every host. Temporary and preview hosts stay out of search
 * through the noindex header in proxy.ts instead of a Disallow here: a blocked
 * crawler can't see the noindex, and the bare URLs could still get listed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    // Merch isn't blocked here: crawlers need to reach it to see its noindex tag.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

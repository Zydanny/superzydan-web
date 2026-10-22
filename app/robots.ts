import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/* Preview deployments stay out of search entirely; production lists the sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    // Merch isn't blocked here: crawlers need to reach it to see its noindex tag.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

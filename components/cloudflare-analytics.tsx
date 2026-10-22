import Script from "next/script";
import { cloudflareAnalyticsToken } from "@/lib/site";

/*
 * Cloudflare's beacon counts page views without cookies or local storage. It
 * follows client-side navigation on its own, so one tag in the layout covers
 * every page. Skipped in development and until the token is filled in.
 */
export function CloudflareAnalytics() {
  if (!cloudflareAnalyticsToken || process.env.NODE_ENV !== "production") return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token: cloudflareAnalyticsToken })}
    />
  );
}

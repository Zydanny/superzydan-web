"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { cloudflareAnalyticsToken } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";

const LIVE_HOSTNAME = new URL(SITE_URL).hostname;

const noSubscribe = () => () => {};

/*
 * Cloudflare's beacon counts page views without cookies or local storage. It
 * follows client-side navigation on its own, so one tag in the layout covers
 * every page. Skipped in development and until the token is filled in.
 *
 * It only loads on www.superzydanofficial.com, so visits to the temporary
 * hosting domain, previews and localhost never count. Pages are prerendered,
 * so the host is read in the browser: the server render has no host and
 * leaves the beacon out, and it's added once the page hydrates.
 */
export function CloudflareAnalytics() {
  const hostname = useSyncExternalStore(
    noSubscribe,
    () => window.location.hostname,
    () => null,
  );

  if (!cloudflareAnalyticsToken || process.env.NODE_ENV !== "production" || hostname !== LIVE_HOSTNAME) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token: cloudflareAnalyticsToken })}
    />
  );
}

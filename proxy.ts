import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/lib/seo";

const LIVE_HOST = new URL(SITE_URL).host;
const WWW_HOST = `www.${LIVE_HOST}`;

/* The first host a header names, lowercased and without a port. */
function hostOf(header: string | null) {
  return header?.split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
}

/*
 * www.superzydanofficial.com redirects to the bare domain for good (308),
 * keeping the path and query string, so old links and Google only ever see one
 * copy.
 *
 * Only the bare domain gets indexed. Temporary hosting domains and previews
 * answer with noindex and are never redirected, so they stay testable. This
 * runs at request time, so pointing a domain at a build needs no rebuild.
 * Checks X-Forwarded-Host too, in case the host's reverse proxy rewrites Host.
 */
export function proxy(request: NextRequest) {
  const hosts = [hostOf(request.headers.get("x-forwarded-host")), hostOf(request.headers.get("host"))];

  if (hosts.includes(WWW_HOST)) {
    // Set the path on the canonical URL instead of joining strings, so a path like //other.site can't change the host.
    const target = new URL(SITE_URL);
    target.pathname = request.nextUrl.pathname;
    // Next hands the proxy a re-serialized query: same keys and values, spaces as +.
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, 308);
  }

  const response = NextResponse.next();

  if (!hosts.includes(LIVE_HOST)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Hashed build assets never show up in search; everything else (pages, images, feeds) is covered.
  matcher: ["/((?!_next/static).*)"],
};

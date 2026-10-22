import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/lib/seo";

const LIVE_HOST = new URL(SITE_URL).host;

/*
 * Only the live domain gets indexed. Temporary hosting domains, previews and
 * the bare superzydanofficial.com (its canonical is www) all answer with
 * noindex, so Google never lists a second copy of the site. This runs at
 * request time, so pointing the live domain at a build needs no rebuild.
 * Checks X-Forwarded-Host too, in case the host's reverse proxy rewrites Host.
 */
export function proxy(request: NextRequest) {
  const hosts = [request.headers.get("x-forwarded-host"), request.headers.get("host")];
  const response = NextResponse.next();

  if (!hosts.some((host) => host?.split(",")[0].trim().toLowerCase() === LIVE_HOST)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Hashed build assets never show up in search; everything else (pages, images, feeds) is covered.
  matcher: ["/((?!_next/static).*)"],
};

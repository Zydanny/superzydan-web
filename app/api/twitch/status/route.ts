import { getTwitchStatus } from "@/lib/twitch";

/* Polled by the client so live status flips without a page reload. */
export const dynamic = "force-dynamic";

export async function GET() {
  // Uncached here: this route exists precisely to bypass the render cache.
  const status = await getTwitchStatus("no-store");

  return Response.json(status, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

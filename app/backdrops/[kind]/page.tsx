import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Home from "@/app/page";
import { Backdrop, BACKDROP_LABELS, BACKDROPS, type BackdropKind } from "@/components/backdrops/backdrop";

/*
 * Prototype previews: the real home page over one of the candidate
 * backgrounds. Kept out of search and the sitemap, and removed once one is
 * picked and applied site-wide.
 */
export const metadata: Metadata = {
  title: { absolute: "Background preview | SuperZydan" },
  robots: { index: false, follow: false },
};

export const revalidate = 900;
export const dynamicParams = false;

export function generateStaticParams() {
  return BACKDROPS.map((kind) => ({ kind }));
}

export default async function BackdropPreview({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!BACKDROPS.includes(kind as BackdropKind)) notFound();

  return (
    <>
      <Backdrop kind={kind as BackdropKind} />
      <Home />
      <nav
        aria-label="Background options"
        className="backdrop-switcher fixed right-2 bottom-2 z-50 flex border border-neon-violet/40 bg-night/90 p-0.5 text-xs font-semibold lg:right-4 lg:bottom-4 lg:text-sm"
      >
        {BACKDROPS.map((option) => (
          <Link
            key={option}
            href={`/backdrops/${option}`}
            prefetch={false}
            aria-current={option === kind ? "page" : undefined}
            className="flex min-h-11 items-center px-2 whitespace-nowrap lg:px-3 text-haze hover:text-white aria-[current=page]:bg-neon-cyan aria-[current=page]:text-night"
          >
            {BACKDROP_LABELS[option].split(" ")[0]}
          </Link>
        ))}
        <Link href="/" prefetch={false} className="flex min-h-11 items-center px-2 text-haze lg:px-3 hover:text-white">
          None
        </Link>
      </nav>
    </>
  );
}

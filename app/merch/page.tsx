import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SpotlightCard } from "@/components/spotlight-card";
import { ShimmerButton } from "@/components/shimmer-button";
import { merchPage, STOREFRONT_URL } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Merch",
  description: merchPage.blurb,
  // Merch isn't ready, so the page stays out of search results and the nav.
  robots: { index: false, follow: false },
};

export default function MerchPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow={merchPage.eyebrow}
        title={merchPage.title}
        description={merchPage.blurb}
      />
      <Section>
        <SpotlightCard className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            No official drop yet — the merch page on the old site still says coming
            soon. The storefront and LTK are the shop for now.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ShimmerButton href={STOREFRONT_URL} external>
              Amazon storefront
            </ShimmerButton>
            <a
              href="https://www.shopltk.com/explore/SuperZydan"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="glass inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-medium hover:border-primary/40 hover:text-primary"
            >
              Browse LTK
            </a>
          </div>
        </SpotlightCard>
      </Section>
    </main>
  );
}

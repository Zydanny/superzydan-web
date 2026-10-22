import type { Metadata } from "next";
import { ShoppingBagIcon } from "lucide-react";
import { NeonButton } from "@/components/neon-button";
import { PageHero } from "@/components/page-hero";
import { merchPage, STOREFRONT_URL } from "@/lib/pages";
import { shopLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Merch | SuperZydan" },
  description: merchPage.blurb,
  // Merch isn't ready, so the page stays out of search results, the nav and the sitemap.
  robots: { index: false, follow: false },
};

export default function MerchPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero title={merchPage.title} tone="magenta" description={merchPage.blurb}>
        <div className="mt-8 flex flex-wrap gap-3">
          <NeonButton href={STOREFRONT_URL} external>
            <ShoppingBagIcon className="size-4" />
            Amazon storefront
          </NeonButton>
          <NeonButton href={shopLinks[1].href} external variant="outline">
            LTK picks
          </NeonButton>
        </div>
      </PageHero>
    </main>
  );
}

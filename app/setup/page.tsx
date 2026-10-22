import type { Metadata } from "next";
import Image from "next/image";
import { ShoppingBagIcon } from "lucide-react";
import { NeonButton } from "@/components/neon-button";
import { PageHero } from "@/components/page-hero";
import { SetupCatalog } from "@/components/pages/setup-catalog";
import { setupGroups, setupHeroPhoto, setupIntro, STOREFRONT_URL } from "@/lib/pages";
import { PAGES, pageMetadata } from "@/lib/seo";
import { shopLinks } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGES.setup);

export default function SetupPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        title="Setup"
        tone="violet"
        description={setupIntro}
        aside={
          <div className="chamfer bg-neon-cyan/70 p-[2px] [--cut:16px]">
            <div className="chamfer relative aspect-[4/3] overflow-hidden bg-night-raised [--cut:15px]">
              <Image
                src={setupHeroPhoto.src}
                alt={setupHeroPhoto.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 36rem"
                className="object-cover"
              />
            </div>
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <NeonButton href={STOREFRONT_URL} external>
            <ShoppingBagIcon className="size-4" />
            Amazon storefront
          </NeonButton>
          <NeonButton href={shopLinks[1].href} external variant="outline">
            LTK picks
          </NeonButton>
        </div>
        <p className="mt-5 max-w-lg text-sm text-pretty text-haze">
          The shop links are affiliate links. As an Amazon Associate I earn from qualifying purchases.
        </p>
      </PageHero>

      <div className="shell shell-y">
        <SetupCatalog groups={setupGroups} />
      </div>
    </main>
  );
}

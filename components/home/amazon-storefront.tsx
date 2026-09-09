import { ShoppingBagIcon, TagIcon } from "lucide-react";
import { SpotlightCard } from "@/components/spotlight-card";
import { ShimmerButton } from "@/components/shimmer-button";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section";
import { affiliateDisclosure } from "@/lib/site";

const STOREFRONT_URL = "https://www.amazon.com/shop/superzydan";

/*
 * Deliberately loud: this used to be muted fine print at the bottom of the gear
 * section, so the storefront link went unnoticed. The legal disclosure stays
 * attached to the CTA, just no longer buried in it.
 */
export function AmazonStorefront() {
  return (
    <Section>
      <Reveal>
        <SpotlightCard
          lift={false}
          className="border-primary/25 p-8 md:p-10"
        >
          {/* Warm glow to separate this block from the neutral bento cards. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-[radial-gradient(circle,var(--glow-emerald),transparent_65%)] opacity-20 blur-3xl"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-eyebrow inline-flex items-center gap-2 text-primary">
                <TagIcon className="size-3.5" />
                Support the channel
              </span>

              <h2 className="text-display mt-4 text-3xl md:text-4xl">
                Shop my Amazon Influencer Storefront
              </h2>

              <p className="mt-4 text-base leading-relaxed text-foreground/80">
                Everything I actually use and recommend — gear, tech, kitchen, and
                household picks — collected in one place to help make your life
                easier, simpler and more organized.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {affiliateDisclosure}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              <ShimmerButton
                href={STOREFRONT_URL}
                external
                className="h-12 justify-center px-7 text-base"
              >
                <ShoppingBagIcon className="size-5" />
                Visit the storefront
              </ShimmerButton>
              <a
                href="https://www.shopltk.com/explore/SuperZydan"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="glass inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
              >
                Browse my LTK picks
              </a>
            </div>
          </div>
        </SpotlightCard>
      </Reveal>
    </Section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { GearBento } from "@/components/pages/gear-bento";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { ShimmerButton } from "@/components/shimmer-button";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import {
  affiliateDisclosure,
  reviewCategories,
  reviewsIntro,
  setupItems,
  STOREFRONT_URL,
} from "@/lib/pages";
import { keyboardReview, keyboardReviewPost } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Product Reviews",
  description: reviewsIntro,
};

const featured = setupItems.filter((item) =>
  ["Custom battlestation", keyboardReview.productName, "Sony Alpha 6000"].includes(
    item.title,
  ),
);

export default function ProductReviewsPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow="Product Reviews"
        title="Gear I actually put on the desk"
        description={reviewsIntro}
      />

      <Section>
        <SectionHeading
          eyebrow="Featured"
          title="PC, Hall Effect board, camera"
          description="The three pieces people ask about most — specs and affiliate links on every card."
        />
        <GearBento items={featured} />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Latest review"
          title="Electronics"
          description="New write-up from the desk — also lives under LifeStyle → Electronics."
        />
        <Reveal>
          <Link href={keyboardReviewPost.url} className="block">
            <SpotlightCard className="group/card grid w-full overflow-hidden p-0 md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto md:min-h-[280px]">
                <Image
                  src={keyboardReview.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                />
              </div>
              <div className="flex flex-col p-6 md:p-8">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary w-fit">
                  {keyboardReview.tag}
                </span>
                <h3 className="text-display mt-4 text-2xl transition-colors group-hover/card:text-primary">
                  {keyboardReview.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {keyboardReview.excerpt}
                </p>
                <p className="text-eyebrow mt-auto inline-flex items-center gap-1.5 pt-6 text-muted-foreground transition-colors group-hover/card:text-primary">
                  Read the review
                  <ArrowUpRightIcon className="size-3.5" />
                </p>
              </div>
            </SpotlightCard>
          </Link>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Browse"
          title="What we cover"
          description="Lifestyle posts and storefront picks, grouped the way the old shop pages were."
        />
        <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviewCategories.map((category) => {
            const card = (
              <SpotlightCard className="group/card flex h-full flex-col p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-display text-lg">{category.label}</h3>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground transition-all group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-primary" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {category.blurb}
                </p>
              </SpotlightCard>
            );

            return (
              <StaggerItem key={category.label}>
                {"external" in category && category.external ? (
                  <a
                    href={category.href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block h-full"
                  >
                    {card}
                  </a>
                ) : (
                  <Link href={category.href} className="block h-full">
                    {card}
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Section>

      <Section>
        <Reveal>
          <div className="glass flex flex-col gap-5 rounded-2xl p-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {affiliateDisclosure}
            </p>
            <ShimmerButton href={STOREFRONT_URL} external>
              Shop the storefront
            </ShimmerButton>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}

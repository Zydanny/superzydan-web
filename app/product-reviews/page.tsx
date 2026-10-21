import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { VlogFeed } from "@/components/home/vlog-feed";
import { GearBento } from "@/components/pages/gear-bento";
import { QuickTakes } from "@/components/pages/quick-takes";
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
import { AMAZON_ASSOCIATE_STATEMENT, isAffiliateUrl } from "@/lib/affiliate";
import { getReviewPosts, toVlogPost } from "@/lib/blog";
import { keyboardReview } from "@/lib/reviews";
import { reviewsChannelUrl } from "@/lib/site";
import { getReviewsChannelUploads } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Product Reviews",
  description: reviewsIntro,
};

const featured = setupItems.filter((item) =>
  ["Custom battlestation", keyboardReview.productName, "Sony Alpha 6000"].includes(
    item.title,
  ),
);

export default async function ProductReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const [reviews, uploads, params] = await Promise.all([
    getReviewPosts(),
    getReviewsChannelUploads(),
    searchParams,
  ]);

  // The filter pills use the product category, so ?category=Keyboards links straight to one.
  const cards = reviews.map((post) => ({ ...toVlogPost(post), tag: post.productCategory ?? "Other" }));
  const requested = Array.isArray(params.category) ? params.category[0] : params.category;
  const initialTag = requested && cards.some((card) => card.tag === requested) ? requested : "All";

  // Shorts without a write-up of their own, newest first. A Short embedded in a post's body counts as written.
  const written = new Set(
    reviews.flatMap((post) => [post.youtubeId, ...[...post.body.matchAll(/<YouTube id="([\w-]{11})"/g)].map((m) => m[1])]),
  );
  const quickTakes = uploads.filter((upload) => upload.short && !written.has(upload.id));
  const quickTakesHaveAmazon = quickTakes.some((upload) => upload.productUrl && isAffiliateUrl(upload.productUrl));

  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow="Product Reviews"
        title="Gear I actually put on the desk"
        description={reviewsIntro}
      />

      {cards.length > 0 ? (
        <VlogFeed
          posts={cards}
          initialTag={initialTag}
          eyebrow="Reviews"
          title="Every review, newest first"
          description="The video, what I actually think, and where to get it. Pick a category to narrow it down."
        />
      ) : null}

      {quickTakes.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="Quick Takes"
            title="Short and to the point"
            description="Shorts from SuperZydan Reviews. Tap one to watch it on YouTube."
          />
          {quickTakesHaveAmazon ? (
            <p className="-mt-4 mb-6 text-sm text-muted-foreground">
              The shop links are affiliate links. If you buy through them I may earn a small commission at no extra
              cost to you. {AMAZON_ASSOCIATE_STATEMENT}
            </p>
          ) : null}
          <QuickTakes shorts={quickTakes} />
          <Reveal>
            <div className="mt-8">
              <ShimmerButton href={reviewsChannelUrl} external>
                Watch the reviews channel
              </ShimmerButton>
            </div>
          </Reveal>
        </Section>
      ) : null}

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

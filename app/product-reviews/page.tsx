import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, PlayIcon } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { VlogFeed } from "@/components/home/vlog-feed";
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

  // Newest channel videos that don't have a write-up yet go straight to YouTube.
  const written = new Set(reviews.map((post) => post.youtubeId));
  const unwritten = uploads.filter((upload) => !written.has(upload.id)).slice(0, 8);

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

      {unwritten.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="On the reviews channel"
            title="Fresh videos, write-ups coming"
            description="The newest uploads from SuperZydan Reviews that don't have a post yet. These open on YouTube."
          />
          <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {unwritten.map((upload) => (
              <StaggerItem key={upload.id}>
                <a
                  href={`https://www.youtube.com/watch?v=${upload.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/card block h-full"
                >
                  <SpotlightCard className="flex h-full flex-col overflow-hidden p-0">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image
                        src={`https://i.ytimg.com/vi/${upload.id}/hqdefault.jpg`}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                      />
                      <span className="absolute right-2 bottom-2 grid size-8 place-items-center rounded-full bg-black/60 text-white">
                        <PlayIcon className="ml-0.5 size-4 fill-current" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="line-clamp-2 text-sm leading-snug font-medium transition-colors group-hover/card:text-primary">
                        {upload.title}
                      </p>
                      <time dateTime={upload.date} className="mt-auto pt-2 text-[11px] text-muted-foreground">
                        {new Date(`${upload.date}T12:00:00Z`).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </time>
                    </div>
                  </SpotlightCard>
                </a>
              </StaggerItem>
            ))}
          </StaggerGroup>
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

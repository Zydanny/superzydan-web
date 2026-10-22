import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CategoryNav } from "@/components/pages/category-nav";
import { QuickTakes } from "@/components/pages/quick-takes";
import { NeonButton } from "@/components/neon-button";
import { PostCard } from "@/components/post-card";
import { SignHeading } from "@/components/sign-heading";
import { AMAZON_ASSOCIATE_STATEMENT, isAffiliateUrl } from "@/lib/affiliate";
import { getReviewPosts } from "@/lib/blog";
import { PAGES, pageMetadata } from "@/lib/seo";
import { reviewsChannelUrl } from "@/lib/site";
import { getReviewsChannelUploads } from "@/lib/youtube";

export const metadata: Metadata = pageMetadata(PAGES.productReviews);

/* The reviews channel feed changes; refresh with the home page's cadence. */
export const revalidate = 900;

const NEWEST = 9;

export default async function ProductReviewsPage() {
  const [reviews, uploads] = await Promise.all([getReviewPosts(), getReviewsChannelUploads()]);

  // Shorts without a write-up of their own, newest first. A Short embedded in a post's body counts as written.
  const written = new Set(
    reviews.flatMap((post) => [post.youtubeId, ...[...post.body.matchAll(/<YouTube id="([\w-]{11})"/g)].map((m) => m[1])]),
  );
  const quickTakes = uploads.filter((upload) => upload.short && !written.has(upload.id));
  const quickTakesHaveAmazon = quickTakes.some((upload) => upload.productUrl && isAffiliateUrl(upload.productUrl));
  const [first, ...rest] = reviews.slice(0, NEWEST);

  return (
    <main id="content" className="flex-1">
      <PageHero
        title="Product Reviews"
        tone="cyan"
        description="Gear, gadgets and kitchen stuff I've actually used, on video. What I think, the good and the bad, and where to get it. My wife and I pick the home and kitchen stuff together."
      >
        <div className="mt-8">
          <CategoryNav reviews={reviews} />
        </div>
      </PageHero>

      {first ? (
        <section aria-labelledby="newest-title" className="shell shell-y">
          <SignHeading id="newest-title" tone="magenta" size="md" sub="Pick a category above for everything in it.">
            Newest reviews
          </SignHeading>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
            <PostCard post={first} feature />
            <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
              {rest.slice(0, 2).map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </div>
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2).map((post) => (
              <li key={post.slug} className="build-in">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {quickTakes.length > 0 ? (
        <section aria-labelledby="quick-title" className="border-t border-neon-violet/20">
          <div className="shell shell-y">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
              <SignHeading
                id="quick-title"
                tone="violet"
                size="md"
                sub="Shorts from SuperZydan Reviews. Tap one to watch it on YouTube."
              >
                Quick Takes
              </SignHeading>
              <NeonButton href={reviewsChannelUrl} external variant="outline">
                The reviews channel
              </NeonButton>
            </div>
            {quickTakesHaveAmazon ? (
              <p className="mt-6 max-w-3xl text-sm text-pretty text-haze">
                The shop links are affiliate links. If you buy through them I may earn a small commission at no extra
                cost to you. {AMAZON_ASSOCIATE_STATEMENT}
              </p>
            ) : null}
            <div className="mt-8">
              <QuickTakes shorts={quickTakes} />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

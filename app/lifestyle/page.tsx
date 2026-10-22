import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PostCard } from "@/components/post-card";
import { getAllPosts, isReview } from "@/lib/blog";
import { PAGES, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(PAGES.lifestyle);

/*
 * The blog: recipes, family stuff, game events, guides. Product reviews have
 * their own page, so they're not repeated here.
 */
export default async function LifestylePage() {
  const posts = (await getAllPosts()).filter((post) => !isReview(post));
  const [first, ...rest] = posts;

  return (
    <main id="content" className="flex-1">
      <PageHero
        title="Lifestyle"
        tone="magenta"
        description="Recipes, family game nights, Roblox events, IRL setups and whatever else we got into. Newest first."
      >
        <Link
          href="/product-reviews"
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-neon-cyan transition-colors hover:text-white"
        >
          Looking for reviews? They live on Product Reviews
          <ArrowRightIcon className="size-4" />
        </Link>
      </PageHero>

      <section aria-label="Posts" className="shell shell-y">
        {first ? <PostCard post={first} feature headingLevel="h2" className="max-w-4xl" /> : null}
        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <li key={post.slug} className="build-in">
              <PostCard post={post} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

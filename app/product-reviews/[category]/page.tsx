import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { CategoryNav } from "@/components/pages/category-nav";
import { PostCard } from "@/components/post-card";
import { getReviewPosts } from "@/lib/blog";
import { REVIEW_CATEGORIES, reviewCategoryBySlug, reviewCategoryPath } from "@/lib/review-categories";
import { breadcrumbJsonLd, PAGES, seoMetadata } from "@/lib/seo";

/* One page per category that has at least one published review. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const reviews = await getReviewPosts();
  return Object.entries(REVIEW_CATEGORIES)
    .filter(([label]) => reviews.some((post) => post.productCategory === label))
    .map(([, category]) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const category = reviewCategoryBySlug((await params).category);
  if (!category) return {};
  return seoMetadata({ path: reviewCategoryPath(category), title: category.title, description: category.description });
}

export default async function ReviewCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const category = reviewCategoryBySlug((await params).category);
  if (!category) notFound();

  const reviews = await getReviewPosts();
  const posts = reviews.filter((post) => post.productCategory === category.label);
  const crumbs = [
    { name: "Home", path: PAGES.home.path },
    { name: "Product Reviews", path: PAGES.productReviews.path },
    { name: category.heading, path: reviewCategoryPath(category) },
  ];

  return (
    <main id="content" className="flex-1">
      <PageHero
        crumbs={crumbs}
        title={`${category.heading} reviews`}
        tone="cyan"
        description={category.intro}
      />

      <section aria-label={`${category.heading} reviews`} className="shell shell-y">
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <li key={post.slug} className={index > 2 ? "build-in" : undefined}>
              <PostCard post={post} headingLevel="h2" priority={index === 0} deferred={index > 0} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="more-title" className="border-t border-neon-violet/20">
        <div className="shell py-12 lg:py-16">
          <h2 id="more-title" className="font-display text-3xl leading-none font-black tracking-wide uppercase">
            More categories
          </h2>
          <div className="mt-6">
            <CategoryNav reviews={reviews} current={category.slug} />
          </div>
          <Link
            href="/product-reviews"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-neon-cyan transition-colors hover:text-white"
          >
            All product reviews
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      <JsonLd nodes={[breadcrumbJsonLd(crumbs)]} />
    </main>
  );
}

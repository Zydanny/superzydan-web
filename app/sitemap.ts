import type { MetadataRoute } from "next";
import { getAllPosts, isReview, postPath } from "@/lib/blog";
import { REVIEW_CATEGORIES, reviewCategoryPath } from "@/lib/review-categories";
import { absoluteUrl, PAGES } from "@/lib/seo";

/*
 * Every published page and post with its last real change. Drafts never reach
 * here (getAllPosts drops them outside review builds, and this filters them again),
 * and Merch stays out until it's ready.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getAllPosts()).filter((post) => !post.draft);
  const newest = (list: { updated: string }[], fallback: string) =>
    list.reduce((latest, post) => (post.updated > latest ? post.updated : latest), fallback);

  const reviews = posts.filter(isReview);
  const pages = Object.values(PAGES).map((page) => {
    // List pages change whenever a post in them does.
    const updated =
      page === PAGES.lifestyle || page === PAGES.home
        ? newest(posts, page.updated)
        : page === PAGES.productReviews
          ? newest(reviews, page.updated)
          : page.updated;
    return { url: absoluteUrl(page.path), lastModified: updated };
  });

  const categories = Object.entries(REVIEW_CATEGORIES)
    .map(([label, category]) => ({ category, inCategory: reviews.filter((post) => post.productCategory === label) }))
    .filter(({ inCategory }) => inCategory.length > 0)
    .map(({ category, inCategory }) => ({
      url: absoluteUrl(reviewCategoryPath(category)),
      lastModified: newest(inCategory, PAGES.productReviews.updated),
    }));

  const postEntries = posts.map((post) => ({
    url: absoluteUrl(postPath(post.slug)),
    lastModified: post.updated,
  }));

  return [...pages, ...categories, ...postEntries];
}

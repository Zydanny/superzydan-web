import { isReview, postPath, postVideoIds, type BlogPost } from "@/lib/blog";
import { reviewCategoryPath, type ReviewCategory } from "@/lib/review-categories";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  PAGES,
  personRef,
  videoJsonLd,
  type VideoDetails,
} from "@/lib/seo";

/* The trail shown above a post and mirrored in its BreadcrumbList. */
export function postBreadcrumbs(post: BlogPost, category: ReviewCategory | null) {
  const trail = [{ name: "Home", path: PAGES.home.path }];
  if (isReview(post)) {
    trail.push({ name: "Product Reviews", path: PAGES.productReviews.path });
    if (category) trail.push({ name: category.heading, path: reviewCategoryPath(category) });
  } else {
    trail.push({ name: "Lifestyle", path: PAGES.lifestyle.path });
  }
  trail.push({ name: post.title, path: postPath(post.slug) });
  return trail;
}

/* Posts only record a day; Google wants a full timestamp with a zone, so pin it to noon UTC. */
function isoDay(date: string) {
  return `${date}T12:00:00Z`;
}

function postImage(post: BlogPost) {
  if (post.cover) return absoluteUrl(post.cover);
  return post.youtubeId ? `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg` : absoluteUrl("/brand/sz-logo.webp");
}

/*
 * The opening of a YouTube description, without its links, hashtags or
 * timestamps: those descriptions carry shortened shop links (some still on an
 * old affiliate tag) that don't belong in this site's data.
 */
export function videoSummary(description: string) {
  const firstParagraph = description.split(/\n\s*\n/)[0] ?? "";
  return firstParagraph
    .replace(/https?:\/\/\S+/g, "")
    .replace(/#\w+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * Everything a post tells search engines: the article, its breadcrumb trail,
 * one VideoObject per embedded YouTube video, and for reviews a Product with
 * its Review. Reviews carry no rating on purpose (the owner doesn't score
 * products), so Google won't show stars for them.
 */
export function postJsonLd(
  post: BlogPost,
  { category, videos }: { category: ReviewCategory | null; videos: Map<string, VideoDetails> },
) {
  const url = absoluteUrl(postPath(post.slug));
  const image = postImage(post);

  const nodes: object[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title.slice(0, 110),
      description: post.seoDescription,
      datePublished: isoDay(post.date),
      dateModified: isoDay(post.updated),
      author: personRef,
      publisher: personRef,
      image,
      url,
      mainEntityOfPage: url,
      articleSection: post.productCategory ?? post.category,
      inLanguage: "en-US",
    },
    breadcrumbJsonLd(postBreadcrumbs(post, category)),
  ];

  for (const id of postVideoIds(post)) {
    const details = videos.get(id);
    nodes.push(
      videoJsonLd(
        details
          ? {
              ...details,
              // Some descriptions open with just a label like "Product:" above the links; use the post's own then.
              description: videoSummary(details.description).length >= 40 ? videoSummary(details.description) : post.seoDescription,
            }
          : { id, title: post.title, description: post.seoDescription, uploadDate: isoDay(post.date) },
      ),
    );
  }

  /*
   * The product carries the review, not the other way round: a bare Product
   * inside a Review fails Google's product check ("offers, review or
   * aggregateRating should be specified"). Checked in the Rich Results Test.
   */
  if (isReview(post)) {
    for (const name of post.reviewedProduct) {
      nodes.push({
        "@type": "Product",
        name,
        image,
        review: {
          "@type": "Review",
          name: post.title,
          reviewBody: post.excerpt || post.seoDescription,
          datePublished: isoDay(post.date),
          url,
          author: personRef,
          publisher: personRef,
        },
      });
    }
  }

  return nodes;
}

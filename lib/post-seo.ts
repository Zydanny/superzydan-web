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

function postImage(post: BlogPost) {
  if (post.cover) return absoluteUrl(post.cover);
  return post.youtubeId ? `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg` : absoluteUrl("/brand/sz-logo.webp");
}

/*
 * Everything a post tells search engines: the article, its breadcrumb trail,
 * one VideoObject per embedded YouTube video, and for reviews a Review per
 * product. Reviews carry no rating on purpose (the owner doesn't score
 * products), which keeps them valid schema.org but not eligible for Google's
 * star snippets.
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
      datePublished: post.date,
      dateModified: post.updated,
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
    nodes.push(
      videoJsonLd(
        videos.get(id) ?? {
          id,
          title: post.title,
          description: post.seoDescription,
          uploadDate: post.date,
        },
      ),
    );
  }

  if (isReview(post)) {
    for (const name of post.reviewedProduct) {
      nodes.push({
        "@type": "Review",
        name: post.title,
        reviewBody: post.excerpt || post.seoDescription,
        datePublished: post.date,
        url,
        author: personRef,
        publisher: personRef,
        itemReviewed: { "@type": "Product", name, image },
      });
    }
  }

  return nodes;
}

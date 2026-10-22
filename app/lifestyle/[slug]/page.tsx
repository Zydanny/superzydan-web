import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { MdxContent } from "@/components/blog/mdx-content";
import { ProductList } from "@/components/blog/product-list";
import { YouTubeEmbed } from "@/components/blog/youtube-embed";
import { DiscordMark } from "@/components/discord-mark";
import { JsonLd } from "@/components/json-ld";
import { NeonButton } from "@/components/neon-button";
import { Breadcrumbs } from "@/components/page-hero";
import { PostCard } from "@/components/post-card";
import { SignHeading } from "@/components/sign-heading";
import {
  getAllPosts,
  getPost,
  getRelatedPosts,
  isPreviewBuild,
  isReview,
  postPath,
  postVideoIds,
  type Disclosure,
} from "@/lib/blog";
import { postBreadcrumbs, postJsonLd } from "@/lib/post-seo";
import { reviewCategory, reviewCategoryPath } from "@/lib/review-categories";
import { seoMetadata } from "@/lib/seo";
import { discordInvite } from "@/lib/site";
import { getVideoDetails } from "@/lib/youtube";

/* Every post is prerendered at build time; unknown slugs are a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};

  const metadata = seoMetadata({
    path: postPath(post.slug),
    title: post.seoTitle,
    description: post.seoDescription,
    image: post.cover ? { url: post.cover, alt: post.coverAlt } : null,
    type: "article",
    noindex: post.draft,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      section: post.productCategory ?? post.category,
    },
  };
}

const DISCLOSURE_LABELS: Record<Disclosure, string> = {
  gifted: "Gifted",
  sponsored: "Sponsored",
  affiliate: "Affiliate links",
  purchased: "Bought it myself",
  "own-product": "My own product",
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const review = isReview(post);
  const category = review ? reviewCategory(post.productCategory) : null;

  // Reviews lead with the video. Older posts already place a <YouTube> embed inside the body.
  // (Chapter links also contain the ID, so look for the embed itself.)
  const bodyEmbedsVideo = post.youtubeId ? post.body.includes(`<YouTube id="${post.youtubeId}"`) : false;
  const videoOnTop = post.youtubeId && !bodyEmbedsVideo ? post.youtubeId : null;

  /*
   * The cover is usually the video's thumbnail or the post's first photo, both
   * already on the page. Only show it up top when it would otherwise be missing.
   */
  const showCover = Boolean(
    post.cover && postVideoIds(post).length === 0 && !post.cover.startsWith("https://i.ytimg.com/") && !post.body.includes(post.cover),
  );

  const [related, videos] = await Promise.all([getRelatedPosts(post), getVideoDetails(postVideoIds(post))]);
  const crumbs = postBreadcrumbs(post, category);

  return (
    <main id="content" className="flex-1">
      <article className="shell pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="mx-auto max-w-2xl">
          <Breadcrumbs crumbs={crumbs} />

          {post.draft ? (
            <p className="mt-3 border border-paint-yellow/50 bg-paint-yellow/10 px-4 py-3 text-sm text-paint-yellow">
              Draft. Only visible locally and on preview links. Set <code>draft: false</code> to publish.
            </p>
          ) : null}

          <header className="mt-6">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold tracking-wide uppercase">
              <span className="font-display neon-cyan text-xl leading-none font-black tracking-[0.08em]">
                {review ? (post.short ? "Quick Review" : "Review") : post.category}
              </span>
              <span aria-hidden className="text-neon-violet">/</span>
              <time dateTime={post.date} className="text-haze">
                {formatDate(post.date)}
              </time>
              <span aria-hidden className="text-neon-violet">/</span>
              <span className="text-haze">{post.readTime} min read</span>
            </p>
            <h1 className="mt-4 text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
              {post.title}
            </h1>
          </header>

          {post.disclosure ? (
            <div className="chamfer mt-7 bg-neon-violet/50 p-[2px] [--cut:10px]">
              <p className="chamfer flex flex-col gap-1 bg-night-raised px-4 py-3 text-pretty text-haze [--cut:9px] sm:flex-row sm:gap-3">
                <span className="shrink-0 font-bold tracking-wide text-white uppercase">
                  {DISCLOSURE_LABELS[post.disclosure.type]}
                </span>
                <span>{post.disclosure.text}</span>
              </p>
            </div>
          ) : review && isPreviewBuild ? (
            <p className="mt-7 border border-paint-yellow/50 bg-paint-yellow/10 px-4 py-3 text-sm text-paint-yellow">
              Disclosure not confirmed. Set <code>disclosure</code> to gifted, sponsored, affiliate, purchased or
              own-product.
            </p>
          ) : null}

          {videoOnTop ? <YouTubeEmbed id={videoOnTop} title={post.title} short={post.short} /> : null}

          {showCover && post.cover ? (
            <div className="chamfer mt-8 bg-neon-violet/40 p-[2px] [--cut:14px]">
              <Image
                src={post.cover}
                alt={post.coverAlt}
                width={1600}
                height={900}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="chamfer aspect-video w-full object-cover [--cut:13px]"
              />
            </div>
          ) : null}

          <div className="mt-8 text-base sm:text-lg">
            <MdxContent source={post.body} />
          </div>

          <ProductList
            products={post.products}
            alternatives={post.alternatives}
            availabilityNote={post.availabilityNote}
            title={post.youtubeId ? "Products in this video" : "Products in this post"}
          />
        </div>
      </article>

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="border-t border-neon-violet/20">
          <div className="shell shell-y">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <SignHeading id="related-title" tone="magenta" size="md">
                Keep reading
              </SignHeading>
              <div className="flex flex-wrap gap-x-6">
                {category ? (
                  <MoreLink href={reviewCategoryPath(category)}>More {category.heading.toLowerCase()} reviews</MoreLink>
                ) : null}
                <MoreLink href="/product-reviews">All product reviews</MoreLink>
              </div>
            </div>
            <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((other) => (
                <li key={other.slug}>
                  <PostCard post={other} />
                </li>
              ))}
            </ul>

            <div className="mt-14 flex flex-col gap-4 border-t border-neon-violet/20 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-lg text-lg text-pretty text-haze">
                Got a question about this one? Ask in the Discord.
              </p>
              <NeonButton href={discordInvite} external variant="outline" className="shrink-0">
                <DiscordMark className="size-4" />
                Join the Discord
              </NeonButton>
            </div>
          </div>
        </section>
      ) : null}

      <JsonLd nodes={postJsonLd(post, { category, videos })} />
    </main>
  );
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-neon-cyan transition-colors hover:text-white"
    >
      {children}
      <ArrowRightIcon className="size-4" />
    </Link>
  );
}

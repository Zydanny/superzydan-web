import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import { MdxContent } from "@/components/blog/mdx-content";
import { ProductList } from "@/components/blog/product-list";
import { YouTubeEmbed } from "@/components/blog/youtube-embed";
import { Reveal } from "@/components/motion/reveal";
import { getAllPosts, getPost, isPreviewBuild, isReview, postPath, type Disclosure } from "@/lib/blog";

/* Every post is prerendered at build time; unknown slugs are a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};

  const images = post.cover ? [{ url: post.cover, alt: post.coverAlt }] : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: postPath(post.slug) },
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: postPath(post.slug),
      publishedTime: post.date,
      section: post.category,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: images?.map((image) => image.url),
    },
  };
}

const DISCLOSURE_LABELS: Record<Disclosure, string> = {
  gifted: "Gifted",
  sponsored: "Sponsored",
  affiliate: "Affiliate links",
  purchased: "Bought it myself",
};

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  /*
   * The cover is usually the post's first photo or its video thumbnail, both
   * already in the body. Only show it up top when it would otherwise be missing.
   */
  const showCover =
    post.cover && !post.cover.startsWith("https://i.ytimg.com/") && !post.body.includes(post.cover);

  // Reviews lead with the video. Older posts already place a <YouTube> embed inside the body.
  // (Chapter links also contain the ID, so look for the embed itself.)
  const review = isReview(post);
  const bodyEmbedsVideo = post.youtubeId ? post.body.includes(`<YouTube id="${post.youtubeId}"`) : false;
  const videoOnTop = post.youtubeId && !bodyEmbedsVideo ? post.youtubeId : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: "SuperZydan" },
    ...(post.cover ? { image: post.cover } : {}),
    mainEntityOfPage: postPath(post.slug),
  };

  return (
    <main id="content" className="flex-1">
      <article className="shell pt-10 pb-20 lg:pt-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href={review ? "/product-reviews" : "/lifestyle"}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeftIcon className="size-4" />
            {review ? "All reviews" : "All posts"}
          </Link>

          {post.draft ? (
            <p className="mt-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              Draft. Only visible locally and on preview links. Set <code>draft: false</code> to publish.
            </p>
          ) : null}

          <Reveal>
            <header className="mt-4">
              <p className="text-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-primary">
                <span>{review && post.short ? "Quick Review" : post.category}</span>
                {post.productCategory ? (
                  <>
                    <span aria-hidden className="text-zinc-600">/</span>
                    <span>{post.productCategory}</span>
                  </>
                ) : null}
                <span aria-hidden className="text-zinc-600">/</span>
                <time dateTime={post.date} className="text-zinc-400">
                  {formatDate(post.date)}
                </time>
                <span aria-hidden className="text-zinc-600">/</span>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <ClockIcon className="size-3.5" />
                  {post.readTime} min read
                </span>
              </p>
              <h1 className="text-display mt-4 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl">
                {post.title}
              </h1>
            </header>
          </Reveal>

          {post.disclosure ? (
            <p className="mt-6 flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-zinc-300 sm:flex-row sm:gap-3">
              <span className="text-eyebrow shrink-0 pt-px text-primary">
                {DISCLOSURE_LABELS[post.disclosure.type]}
              </span>
              <span>{post.disclosure.text}</span>
            </p>
          ) : review && isPreviewBuild ? (
            <p className="mt-6 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              Disclosure not confirmed. Set <code>disclosure</code> to gifted, sponsored, affiliate or purchased.
            </p>
          ) : null}

          {videoOnTop ? <YouTubeEmbed id={videoOnTop} title={post.title} short={post.short} /> : null}

          {showCover && post.cover && !videoOnTop ? (
            <Image
              src={post.cover}
              alt={post.coverAlt}
              width={1600}
              height={900}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="mt-8 aspect-video w-full rounded-3xl border border-border object-cover"
            />
          ) : null}

          <div className="mt-8 text-base sm:text-lg">
            <MdxContent source={post.body} />
          </div>

          <ProductList
            products={post.products}
            alternatives={post.alternatives}
            title={post.youtubeId ? "Products in this video" : "Products in this post"}
          />
        </div>
      </article>

      <script
        type="application/ld+json"
        // Static data from our own content files, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}

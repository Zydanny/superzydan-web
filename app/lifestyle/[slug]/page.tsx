import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import { MdxContent } from "@/components/blog/mdx-content";
import { ProductList } from "@/components/blog/product-list";
import { Reveal } from "@/components/motion/reveal";
import { getAllPosts, getPost, postPath } from "@/lib/blog";

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
            href="/lifestyle"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeftIcon className="size-4" />
            All posts
          </Link>

          <Reveal>
            <header className="mt-4">
              <p className="text-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-primary">
                <span>{post.category}</span>
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

          {showCover && post.cover ? (
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

          <ProductList products={post.products} />
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

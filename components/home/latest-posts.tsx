import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { SignHeading } from "@/components/sign-heading";
import type { BlogPost } from "@/lib/blog";

/* The newest three posts: one big, two beside it. */
export function LatestPosts({ posts }: { posts: BlogPost[] }) {
  const [first, ...rest] = posts;
  if (!first) return null;

  return (
    <section aria-labelledby="posts-title" className="render-later shell shell-y">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <SignHeading id="posts-title" tone="magenta" size="md" sub="Reviews, recipes and whatever we got into this week.">
          Fresh posts
        </SignHeading>
        <div className="flex flex-wrap gap-x-6">
          <MoreLink href="/lifestyle">All posts</MoreLink>
          <MoreLink href="/product-reviews">All reviews</MoreLink>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
        <PostCard post={first} feature className="build-in" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
          {rest.map((post, index) => (
            <PostCard
              key={post.slug}
              post={post}
              className="build-in"
              // Siblings arrive one after another.
              {...{ style: { "--i": index + 1 } as CSSProperties }}
            />
          ))}
        </div>
      </div>
    </section>
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

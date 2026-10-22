import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";
import { DeferredImage } from "@/components/deferred-image";
import type { BlogPost } from "@/lib/blog";
import { isReview } from "@/lib/blog";

function postLabel(post: BlogPost) {
  if (isReview(post)) return post.short ? "Quick Review" : (post.productCategory ?? "Review");
  return post.category;
}

/*
 * A post as a screen on the wall, the same frame as the Watch thumbnails: cut
 * corners, a violet edge that lights cyan on hover or keyboard focus. `feature`
 * is the big one at the head of a list.
 */
export function PostCard({
  post,
  feature = false,
  priority = false,
  deferred = false,
  headingLevel = "h3",
  className,
}: {
  post: BlogPost;
  feature?: boolean;
  /** Load the picture straight away: for the first card on a page, usually its largest image. */
  priority?: boolean;
  /** Hold the picture until the visitor starts scrolling (for grids just under the first screen). */
  deferred?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  const Picture = deferred ? DeferredImage : Image;

  return (
    <Link href={`/lifestyle/${post.slug}`} className={cn("group/card block", className)}>
      <div
        className={cn(
          "chamfer bg-neon-violet/40 p-[2px] transition-colors duration-200 group-hover/card:bg-neon-cyan group-focus-visible/card:bg-neon-cyan",
          feature ? "[--cut:16px]" : "[--cut:12px]",
        )}
      >
        <div
          className={cn(
            "chamfer relative overflow-hidden bg-night-raised",
            feature ? "aspect-[16/10] [--cut:15px]" : "aspect-video [--cut:11px]",
          )}
        >
          {post.cover ? (
            <Picture
              src={post.cover}
              alt={post.coverAlt}
              fill
              preload={priority}
              fetchPriority={priority ? "high" : undefined}
              loading={priority ? "eager" : undefined}
              sizes={feature ? "(min-width: 1024px) 44rem, 100vw" : "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"}
              className="object-cover transition-transform duration-300 ease-(--ease-out) group-hover/card:scale-[1.03]"
            />
          ) : (
            <span className="font-display neon-violet absolute inset-0 grid place-items-center p-4 text-center text-3xl font-black uppercase">
              {postLabel(post)}
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm font-bold tracking-wide text-neon-cyan uppercase">
        <span>{postLabel(post)}</span>
        <span aria-hidden className="text-neon-violet">/</span>
        <span className="text-haze">{post.readTime} min read</span>
      </p>
      <Heading
        className={cn(
          "mt-2 font-bold text-balance transition-colors group-hover/card:text-neon-cyan",
          feature ? "text-2xl leading-tight lg:text-3xl" : "text-lg leading-snug",
        )}
      >
        {post.title}
      </Heading>
      {post.excerpt ? (
        <p className={cn("mt-2 text-pretty text-haze", feature ? "line-clamp-3 text-lg" : "line-clamp-2")}>
          {post.excerpt}
        </p>
      ) : null}
    </Link>
  );
}

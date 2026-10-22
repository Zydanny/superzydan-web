import Link from "next/link";
import { cn } from "cn";
import type { BlogPost } from "@/lib/blog";
import { REVIEW_CATEGORIES, reviewCategoryPath } from "@/lib/review-categories";

/*
 * Every review category as a link to its own page, with how many reviews it
 * has. One swipeable row on phones so it never stacks into a wall of pills;
 * wraps on wider screens.
 */
export function CategoryNav({ reviews, current }: { reviews: BlogPost[]; current?: string }) {
  const categories = Object.entries(REVIEW_CATEGORIES)
    .map(([label, category]) => ({
      category,
      count: reviews.filter((post) => post.productCategory === label).length,
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count || a.category.heading.localeCompare(b.category.heading));

  return (
    <nav aria-label="Review categories">
      <ul className="relative -mx-4 flex snap-x gap-2.5 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {categories.map(({ category, count }) => {
          const active = category.slug === current;
          return (
            <li key={category.slug} className="shrink-0 snap-start">
              <Link
                href={reviewCategoryPath(category)}
                // Fourteen chips sit in the first screen; prefetching them all would compete with the page's own images.
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/cat chamfer flex min-h-11 items-center gap-2 p-[2px] [--cut:8px]",
                  active ? "bg-neon-cyan" : "bg-neon-violet/45 hover:bg-neon-cyan",
                )}
              >
                <span
                  className={cn(
                    "chamfer flex min-h-10 items-center gap-2 px-3.5 text-sm font-bold whitespace-nowrap [--cut:7px]",
                    active ? "bg-neon-cyan text-night" : "bg-night-raised text-white",
                  )}
                >
                  {category.heading}
                  <span className={cn("tabular-nums", active ? "text-night/70" : "text-haze")}>{count}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

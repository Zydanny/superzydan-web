"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRightIcon, ClockIcon } from "lucide-react";
import { cn } from "cn";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import type { VlogPost } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function VlogFeed({
  posts,
  heading = true,
  initialTag = "All",
  eyebrow = "Lifestyle",
  title = "Latest from the blog",
  description = "Reviews, recipes, and kitchen chaos, newest first.",
}: {
  posts: VlogPost[];
  heading?: boolean;
  initialTag?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const [activeTag, setActiveTag] = useState(initialTag);

  // Filters come from whatever categories the live posts actually use.
  const tags = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.tag)))],
    [posts],
  );

  const visible =
    activeTag === "All"
      ? posts
      : posts.filter((post) => post.tag === activeTag);

  return (
    <Section divider={heading}>
      {heading ? (
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      ) : null}

      <div className="mb-8 flex flex-wrap items-center gap-2">
        {tags.map((tag) => {
          const isActive = tag === activeTag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              aria-pressed={isActive}
              className={cn(
                "relative min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="vlog-tag-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_0_20px_-8px_var(--glow-emerald)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              {tag}
            </button>
          );
        })}
      </div>

      {/*
        `popLayout` lets the remaining cards slide into place while filtered
        cards animate out, instead of the grid snapping.
      */}
      <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((post) => (
            <motion.div
              key={post.url}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <VlogCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}

function VlogCard({ post }: { post: VlogPost }) {
  const internal = Boolean(post.internal || post.url.startsWith("/"));
  const card = (
    <SpotlightCard className="group/card flex h-full gap-4 p-4 sm:flex-row">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:aspect-square sm:w-32">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 128px"
            className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
          />
        ) : (
          <span className="text-eyebrow flex size-full items-center justify-center bg-[linear-gradient(135deg,color-mix(in_oklch,var(--glow-emerald)_20%,var(--card)),color-mix(in_oklch,var(--glow-cyan)_16%,var(--card)))] p-2 text-center text-muted-foreground">
            {post.tag}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            {post.tag}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <ClockIcon className="size-3" />
            {post.readTime} min read
          </span>
        </div>

        <h3 className="mt-2.5 text-base leading-snug font-medium transition-colors group-hover/card:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <p className="text-eyebrow mt-auto inline-flex items-center gap-1.5 pt-4 text-muted-foreground transition-colors group-hover/card:text-primary">
          Read the post
          <ArrowUpRightIcon className="size-3" />
        </p>
      </div>
    </SpotlightCard>
  );

  if (internal) {
    return (
      <Link href={post.url} className="block h-full">
        {card}
      </Link>
    );
  }

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      {card}
    </a>
  );
}

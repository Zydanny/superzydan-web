import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import YAML from "yaml";
import type { VlogPost } from "@/lib/site";

/*
 * Blog posts live in content/blog/<slug>.mdx: YAML frontmatter between `---`
 * lines, then the post body in Markdown. One file per post so a post can be
 * edited from the GitHub website without touching code.
 */
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const WORDS_PER_MINUTE = 200;

export type BlogProduct = {
  name: string;
  url: string;
  note?: string;
};

export type BlogPost = {
  title: string;
  slug: string;
  /** YYYY-MM-DD. */
  date: string;
  category: string;
  excerpt: string;
  /** Local path under public/ or an i.ytimg.com thumbnail. Null when the post has no art. */
  cover: string | null;
  coverAlt: string;
  readTime: number;
  youtubeId?: string;
  products: BlogProduct[];
  /** Drafts only show in `npm run dev`, never in a production build. */
  draft: boolean;
  /** Markdown/MDX body without the frontmatter. */
  body: string;
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    // Fail the build loudly rather than publish a post with a missing title or date.
    throw new Error(`content/blog/${file}: frontmatter "${key}" is missing or empty`);
  }
  return value.trim();
}

function parseProducts(value: unknown, file: string): BlogProduct[] {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new Error(`content/blog/${file}: "products" must be a list`);
  }
  return value.map((entry, index) => {
    const product = entry as Record<string, unknown>;
    if (typeof product?.name !== "string" || typeof product?.url !== "string") {
      throw new Error(`content/blog/${file}: product ${index + 1} needs a name and a url`);
    }
    return {
      name: product.name,
      url: product.url,
      ...(typeof product.note === "string" ? { note: product.note } : {}),
    };
  });
}

function parsePost(file: string, raw: string): BlogPost {
  const match = FRONTMATTER.exec(raw);
  if (!match) throw new Error(`content/blog/${file}: missing --- frontmatter block`);

  const data = (YAML.parse(match[1]) ?? {}) as Record<string, unknown>;
  const body = raw.slice(match[0].length).trim();

  // YAML reads an unquoted 2025-08-16 as a string with the default schema, but accept a Date too.
  const rawDate = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
  const date = requireString({ date: rawDate }, "date", file);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`content/blog/${file}: date must look like 2025-08-16`);
  }

  const slug = path.basename(file, ".mdx");
  const words = body.replace(/<[^>]+>|[#*_>`[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;

  return {
    title: requireString(data, "title", file),
    slug,
    date,
    category: typeof data.category === "string" ? data.category : "Lifestyle",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    cover: typeof data.cover === "string" && data.cover ? data.cover : null,
    coverAlt: typeof data.coverAlt === "string" ? data.coverAlt : requireString(data, "title", file),
    readTime:
      typeof data.readTime === "number" ? data.readTime : Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    ...(typeof data.youtubeId === "string" && data.youtubeId ? { youtubeId: data.youtubeId } : {}),
    products: parseProducts(data.products, file),
    draft: data.draft === true,
    body,
  };
}

const showDrafts = process.env.NODE_ENV === "development";

/* Every visible post, newest first. Cached per request. */
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const files = (await readdir(BLOG_DIR)).filter((file) => file.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => parsePost(file, await readFile(path.join(BLOG_DIR, file), "utf8"))),
  );

  return posts
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)));
});

export async function getPost(slug: string): Promise<BlogPost | null> {
  return (await getAllPosts()).find((post) => post.slug === slug) ?? null;
}

export function postPath(slug: string) {
  return `/lifestyle/${slug}`;
}

/* Shape the existing feed cards expect. */
export function toVlogPost(post: BlogPost): VlogPost {
  return {
    title: post.title,
    excerpt: post.excerpt,
    tag: post.category,
    readTime: post.readTime,
    status: "Published",
    thumbnail: post.cover,
    url: postPath(post.slug),
    internal: true,
  };
}

export async function getVlogPosts(limit?: number): Promise<VlogPost[]> {
  const posts = (await getAllPosts()).map(toVlogPost);
  return limit ? posts.slice(0, limit) : posts;
}

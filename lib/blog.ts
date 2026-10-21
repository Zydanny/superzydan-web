import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import YAML from "yaml";
import { isAmazonProductPage, withAssociateTag } from "@/lib/affiliate";
import { AMAZON_ASSOCIATE_TAG, type VlogPost } from "@/lib/site";

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
  /** Where the link goes, for links that hide it (geni.us). "Amazon" gets the Amazon button and statement. */
  store?: string;
};

/* Another product to look at, listed under the review's own product. Always an amazon.com product page. */
export type BlogAlternative = BlogProduct & {
  /** One line on why someone might pick it instead. */
  why: string;
  /** True only for products the owner has reviewed or keeps in his storefront. */
  tested: boolean;
  /** A short summary of a named outside review, never Amazon customer reviews. */
  othersSay?: { text: string; source: string; url: string };
};

/* Posts with this category show on the Product Reviews page. */
export const REVIEW_CATEGORY = "Reviews";

/*
 * How the owner got the product. Every review needs a `disclosure`. The rule:
 * `purchased` unless the video says the product was sent or sponsored,
 * `own-product` for things the owner made and sells himself, and
 * `unclear` only when it hints at that without saying so (shows nothing on the
 * live site until confirmed). `disclosureNote` overrides the wording.
 */
export const DISCLOSURES = {
  gifted: "The brand sent me this for free. No money changed hands, and all opinions are mine.",
  sponsored: "This is a paid partnership with the brand. All opinions are mine.",
  affiliate: "Nobody paid me or sent me this. I may earn a commission from the links in this post.",
  purchased: "I bought this myself. Nobody paid me or sent me anything for this review.",
  "own-product": "I made this. It's my own product, so I earn from every sale.",
} as const;

export type Disclosure = keyof typeof DISCLOSURES;

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
  /** The video is a vertical Short: the embed renders 9:16 and the post is a Quick Review. */
  short: boolean;
  /** Reviews only: Keyboards, Audio, Kitchen... The Product Reviews filters come from this. */
  productCategory?: string;
  /** Reviews only. Null while the owner still has to confirm (`disclosure: unclear`). */
  disclosure: { type: Disclosure; text: string } | null;
  products: BlogProduct[];
  alternatives: BlogAlternative[];
  /** Drafts show in `npm run dev` and on Vercel preview links, never on the live site. */
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

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseProduct(entry: unknown, label: string, file: string): BlogProduct {
  const product = entry as Record<string, unknown>;
  if (typeof product?.name !== "string" || typeof product?.url !== "string") {
    throw new Error(`content/blog/${file}: ${label} needs a name and a url`);
  }
  const note = optionalString(product.note);
  const store = optionalString(product.store);
  return {
    name: product.name,
    url: withAssociateTag(product.url),
    ...(note ? { note } : {}),
    ...(store ? { store } : {}),
  };
}

function parseList(value: unknown, key: string, file: string): unknown[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`content/blog/${file}: "${key}" must be a list`);
  return value;
}

function parseAlternative(entry: unknown, index: number, file: string): BlogAlternative {
  const label = `alternative ${index + 1}`;
  const data = entry as Record<string, unknown>;
  const why = optionalString(data?.why);
  if (!why) throw new Error(`content/blog/${file}: ${label} needs a "why" line`);
  if (typeof data.tested !== "boolean") {
    throw new Error(`content/blog/${file}: ${label} needs "tested: true" or "tested: false"`);
  }
  // Alternatives are always an amazon.com product page with our tag, so the link is checkable from the file.
  const product = parseProduct(entry, label, file);
  if (!isAmazonProductPage(product.url)) {
    throw new Error(
      `content/blog/${file}: ${label} must link to an amazon.com/dp/<ASIN> page with tag=${AMAZON_ASSOCIATE_TAG}`,
    );
  }
  const others = (data.othersSay ?? {}) as Record<string, unknown>;
  const text = optionalString(others.text);
  const source = optionalString(others.source);
  const url = optionalString(others.url);
  return {
    ...product,
    why,
    tested: data.tested,
    ...(text && source && url ? { othersSay: { text, source, url } } : {}),
  };
}

function parseDisclosure(data: Record<string, unknown>, review: boolean, file: string) {
  const type = data.disclosure;
  if (typeof type === "string" && type in DISCLOSURES) {
    const key = type as Disclosure;
    return { type: key, text: optionalString(data.disclosureNote) ?? DISCLOSURES[key] };
  }
  if (review && type !== "unclear") {
    throw new Error(
      `content/blog/${file}: reviews need "disclosure" (${Object.keys(DISCLOSURES).join(", ")}, or unclear)`,
    );
  }
  return null;
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
  const category = typeof data.category === "string" ? data.category : "Lifestyle";
  const draft = data.draft === true;
  const productCategory = optionalString(data.productCategory);

  return {
    title: requireString(data, "title", file),
    slug,
    date,
    category,
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    cover: typeof data.cover === "string" && data.cover ? data.cover : null,
    coverAlt: typeof data.coverAlt === "string" ? data.coverAlt : requireString(data, "title", file),
    readTime:
      typeof data.readTime === "number" ? data.readTime : Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    ...(typeof data.youtubeId === "string" && data.youtubeId ? { youtubeId: data.youtubeId } : {}),
    short: data.short === true,
    ...(productCategory ? { productCategory } : {}),
    disclosure: parseDisclosure(data, category === REVIEW_CATEGORY, file),
    products: parseList(data.products, "products", file).map((entry, index) =>
      parseProduct(entry, `product ${index + 1}`, file),
    ),
    alternatives: parseList(data.alternatives, "alternatives", file).map((entry, index) =>
      parseAlternative(entry, index, file),
    ),
    draft,
    body,
  };
}

/* Local dev and Vercel preview links: drafts and owner-only notes show here, never on the live site. */
export const isPreviewBuild = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";

/* Every visible post, newest first. Cached per request. */
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const files = (await readdir(BLOG_DIR)).filter((file) => file.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => parsePost(file, await readFile(path.join(BLOG_DIR, file), "utf8"))),
  );

  return posts
    .filter((post) => isPreviewBuild || !post.draft)
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)));
});

export function isReview(post: BlogPost) {
  return post.category === REVIEW_CATEGORY;
}

export async function getReviewPosts(): Promise<BlogPost[]> {
  return (await getAllPosts()).filter(isReview);
}

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

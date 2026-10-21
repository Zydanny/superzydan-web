#!/usr/bin/env node
/*
 * One-off migration: WordPress export (WXR) -> content/blog/<slug>.mdx.
 *
 *   node scripts/wxr-to-mdx.mjs <export.xml> <uploads-dir>
 *
 * <uploads-dir> is an extracted copy of wp-content/uploads (the folder that
 * holds 2025/, 2021/ ...). Only images a published post actually uses are
 * copied, into public/blog/<slug>/ as WebP. Drafts are skipped.
 *
 * Prints a JSON report (posts, problems, redirects) to stdout.
 */
import { access, mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import sharp from "sharp";
import YAML from "yaml";

const [xmlPath, uploadsDir] = process.argv.slice(2);
if (!xmlPath || !uploadsDir) {
  console.error("Usage: node scripts/wxr-to-mdx.mjs <export.xml> <uploads-dir>");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "blog");
const PUBLIC_DIR = path.join(ROOT, "public", "blog");
const MAX_IMAGE_WIDTH = 1600;
const WORDS_PER_MINUTE = 200;

/*
 * WordPress categories collapsed into the filters the Lifestyle page shows.
 * "Kitchen" and "Home & Kitchen" were used interchangeably.
 */
const CATEGORY_ALIASES = { Kitchen: "Home & Kitchen", "Lifestyle & Mindset": "Lifestyle" };

/* Posts filed only under "Uncategorized" in WordPress. */
const CATEGORY_OVERRIDES = {
  // Roblox Grow a Garden event stream.
  "grow-a-garden-chris-p-bacon-cooking-event": "Gaming",
};

const report = { posts: [], problems: [], redirects: [] };
const problem = (slug, message) => report.problems.push({ slug, message });

/* ---------- XML ---------- */

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  htmlEntities: true,
  isArray: (name) => ["item", "category", "wp:postmeta"].includes(name),
});
const channel = parser.parse(readFileSync(xmlPath, "utf8")).rss.channel;
const published = channel.item.filter(
  (item) => item["wp:post_type"] === "post" && item["wp:status"] === "publish",
);
const publishedSlugs = new Set(published.map((item) => item["wp:post_name"]));

/* The Associates tag the affiliate blocks already use, for blocks that saved only an ASIN. */
const associatesTag = /amazon\.com\/dp\/[A-Z0-9]{10}\?tag=([\w-]+)/.exec(
  published.map((item) => item["content:encoded"] ?? "").join("\n"),
)?.[1];

/* ---------- helpers ---------- */

const text = (value) => (typeof value === "object" ? (value?.["#text"] ?? "") : (value ?? ""));

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

/* Amazon titles are SEO keyword lists; keep the product name before the first separator. */
function shortProductName(title) {
  const short = decodeEntities(title).split(/\s+[-–|]\s+|,\s/)[0].trim();
  return short.length > 80 ? `${short.slice(0, short.lastIndexOf(" ", 80))}…` : short;
}

function slugifyFile(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function humanize(fileBase) {
  return fileBase
    .replace(/-\d+x\d+$/, "")
    .replace(/-scaled$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

const exists = (file) => access(file).then(() => true, () => false);

/* Any URL into the old media library, on any of the hosts WordPress used. */
function uploadsPath(url) {
  const match = /^(?:https?:)?\/\/(?:www\.)?superzydanofficial(?:\.com|-com-\d+\.hostingersite\.com)\/wp-content\/uploads\/([^?#]+)/i.exec(
    url.trim(),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function youtubeId(url) {
  return /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/i.exec(url)?.[1] ?? null;
}

async function youtubeThumbnail(id) {
  const maxRes = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const probe = await fetch(maxRes, { method: "HEAD" }).catch(() => null);
  return probe?.ok ? maxRes : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/* ---------- images ---------- */

/*
 * WordPress serves resized copies like name-1024x766.png. Prefer the original
 * upload when it exists so the WebP is made from the best source.
 */
async function resolveUpload(relPath) {
  const original = relPath.replace(/-\d+x\d+(\.\w+)$/, "$1");
  for (const candidate of [original, relPath]) {
    const file = path.join(uploadsDir, candidate);
    if (await exists(file)) return file;
  }
  return null;
}

async function copyImage(slug, sourceFile) {
  const ext = path.extname(sourceFile).toLowerCase();
  const base = slugifyFile(path.basename(sourceFile, ext).replace(/-scaled$/, ""));
  const outDir = path.join(PUBLIC_DIR, slug);
  await mkdir(outDir, { recursive: true });

  // Animated GIFs would lose their animation as WebP; copy them as they are.
  if (ext === ".gif") {
    const out = path.join(outDir, `${base}.gif`);
    await writeFile(out, readFileSync(sourceFile));
    return `/blog/${slug}/${base}.gif`;
  }

  const out = path.join(outDir, `${base}.webp`);
  await sharp(sourceFile)
    .rotate()
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  return `/blog/${slug}/${base}.webp`;
}

/* ---------- HTML clean-up before Markdown ---------- */

function extractBlocks(html, slug) {
  const tokens = [];
  const token = (jsx) => {
    tokens.push(jsx);
    return `<p>EMBEDTOKEN${tokens.length - 1}</p>`;
  };
  const products = [];

  html = html.replace(
    /<!-- wp:embed (\{.*?\}) -->[\s\S]*?<!-- \/wp:embed -->/g,
    (_, json) => {
      const url = JSON.parse(json).url ?? "";
      const id = youtubeId(url);
      if (id) return token(`<YouTube id="${id}"${/\/shorts\//.test(url) ? " short" : ""} />`);
      if (/tiktok\.com/.test(url)) return token(`<TikTok url="${url.split("?")[0]}" />`);
      problem(slug, `Dropped an embed it couldn't convert: ${url}`);
      return "";
    },
  );

  html = html.replace(
    /<iframe[^>]+src="([^"]+)"[^>]*>\s*<\/iframe>/gi,
    (_, src) => {
      const id = youtubeId(src);
      if (id) return token(`<YouTube id="${id}" />`);
      problem(slug, `Dropped an iframe: ${src}`);
      return "";
    },
  );

  html = html.replace(/<!-- wp:hostinger-affiliate-plugin\/block (\{.*?\}) \/-->/g, (_, json) => {
    const block = JSON.parse(json);
    const order = String(block.asin_manual ?? block.asin ?? "")
      .split(",")
      .map((asin) => asin.trim())
      .filter(Boolean);
    for (const asin of order) {
      const item = block.items?.[asin];
      if (!item) continue;
      let url = item.url ?? item.product_url ?? null;
      if (!url && associatesTag) {
        url = `https://www.amazon.com/dp/${asin}?tag=${associatesTag}`;
        problem(slug, `Product "${shortProductName(item.title)}" had no saved link; built it from its ASIN ${asin} and the existing Associates tag.`);
      }
      if (!url) {
        problem(slug, `Product "${shortProductName(item.title)}" (ASIN ${asin}) has no link and was left out.`);
        continue;
      }
      if (!products.some((product) => product.url === url)) {
        products.push({ name: shortProductName(item.title), url });
      }
    }
    return "";
  });

  // Share buttons and spacers are theme furniture, not content.
  html = html
    .replace(/<!-- wp:uagb\/social-share[\s\S]*?<!-- \/wp:uagb\/social-share -->/g, "")
    .replace(/<div[^>]*class="wp-block-spacer"[^>]*><\/div>/g, "");

  // Boilerplate "Connect with me" link lists. The site footer covers these, and one has a placeholder Discord link.
  if (/<div class="social-links"/.test(html)) {
    html = html.replace(/<div class="social-links"[\s\S]*?<\/ul>\s*<\/div>/g, "");
    problem(slug, 'Removed the boilerplate "Connect with me" link list (it had a placeholder Discord link and an X link).');
  }

  if (/data-pin-do=/.test(html)) {
    html = html.replace(/<section[^>]*>\s*<h3[^>]*>Inspiration from My Journey[\s\S]*?<\/section>/g, "");
    html = html.replace(/<a[^>]*data-pin-do=[^>]*>\s*<\/a>/g, "");
    problem(slug, "Removed the Pinterest pin gallery (it relied on Pinterest's embed script).");
  }

  // The first <h1> repeats the post title, which the page already shows.
  html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "");

  // A hand-written "Last Updated" line; the post date is shown by the page.
  html = html.replace(/<p[^>]*>\s*Last Updated:[\s\S]*?<\/p>/g, "");

  // Spectra's default heading text got typed into two real headings.
  if (/Attractive Heading/.test(html)) {
    html = html.replace(/(?:Your )?Attractive Heading/g, "").replace(/Your The Backpack/g, "The Backpack");
    problem(slug, 'Removed leftover "Your Attractive Heading" placeholder text from headings.');
  }

  return { html, tokens, products };
}

/* ---------- Markdown ---------- */

function makeTurndown(slug, imageMap) {
  const td = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
  });
  td.use(gfm);
  td.remove(["style", "script", "link", "noscript", "button", "form", "svg", "time"]);

  td.addRule("h1-as-h2", {
    filter: "h1",
    replacement: (content) => `\n\n## ${content.trim()}\n\n`,
  });

  td.addRule("images", {
    filter: "img",
    replacement: (_, node) => {
      const src = node.getAttribute("src") ?? "";
      const mapped = imageMap.get(src);
      if (!mapped) return "";
      const alt = (node.getAttribute("alt") || node.getAttribute("title") || mapped.fallbackAlt)
        .replace(/[[\]]/g, "")
        .trim();
      return `\n\n![${alt}](${mapped.path})\n\n`;
    },
  });

  td.addRule("links", {
    filter: (node) => node.nodeName === "A" && node.getAttribute("href"),
    replacement: (content, node) => {
      const href = node.getAttribute("href").trim();
      // A link wrapping an uploaded image is a lightbox; keep just the image.
      if (uploadsPath(href) && node.querySelector("img")) return content;
      if (!content.trim()) return "";

      let target = href;
      const own = /^https?:\/\/(?:www\.)?superzydanofficial\.com(\/[^?#]*)?/i.exec(href);
      if (own && !uploadsPath(href)) {
        const pathname = (own[1] ?? "/").replace(/\/+$/, "") || "/";
        const postSlug = pathname.slice(1);
        target = publishedSlugs.has(postSlug) ? `/lifestyle/${postSlug}` : pathname;
      } else if (uploadsPath(href)) {
        problem(slug, `Link to an old upload left pointing at WordPress: ${href}`);
      }
      return `[${content.trim()}](${target.replace(/\)/g, "%29")})`;
    },
  });

  return td;
}

/* MDX treats { } and < as code/JSX; escape them everywhere except the embed lines. */
function escapeMdx(markdown) {
  return markdown
    .split("\n")
    .map((line) => (/^<(YouTube|TikTok) /.test(line) ? line : line.replace(/([{}<])/g, "\\$1")))
    .join("\n");
}

/*
 * WordPress paragraphs often end in <br> tags, which Turndown turns into
 * two-space hard breaks. Keep hard breaks inside a paragraph, but drop them
 * at paragraph ends and on lines that are otherwise blank.
 */
function tidyBreaks(markdown) {
  const lines = markdown.split("\n");
  return lines
    .map((line, index) => {
      if (!line.trim()) return "";
      const next = lines[index + 1];
      return next === undefined || !next.trim() ? line.trimEnd() : line;
    })
    .join("\n");
}

/* No-break and zero-width characters slip in from the WordPress editor. */
function normalizeSpaces(value) {
  return [...value]
    .map((char) => {
      const code = char.codePointAt(0);
      if (code === 0xa0 || code === 0x202f || (code >= 0x2000 && code <= 0x200a)) return " ";
      if ((code >= 0x200b && code <= 0x200f) || code === 0x2060 || code === 0xfeff || code === 0xad) return "";
      return char;
    })
    .join("");
}

const isDisclosure = (block) => /affiliate links?|amazon associate/i.test(block);

function plainText(markdown) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>|\\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFrom(markdown) {
  const paragraph =
    markdown
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find(
        (block) =>
          block &&
          !/^(#|!\[|\[!\[|<|-|\||\d+\.)/.test(block) &&
          !isDisclosure(block) &&
          !/^\*\*[^*]+\*\*$/.test(block) && // a bold line is a sub-heading, not an intro

          plainText(block).length > 40,
      ) ?? "";
  const plain = plainText(paragraph);
  return plain.length <= 160 ? plain : `${plain.slice(0, plain.lastIndexOf(" ", 157))}…`;
}

/* ---------- main ---------- */

await mkdir(CONTENT_DIR, { recursive: true });

for (const item of published) {
  const slug = item["wp:post_name"];
  const title = normalizeSpaces(decodeEntities(text(item.title))).trim();
  const date = String(item["wp:post_date"]).slice(0, 10);
  const raw = item["content:encoded"] ?? "";

  const { html, tokens, products } = extractBlocks(raw, slug);

  // Every in-body image, mapped to its new local WebP. Anything not in the media library is dropped.
  const imageMap = new Map();
  for (const [, src] of html.matchAll(/<img[^>]+src="([^"]+)"/gi)) {
    if (imageMap.has(src)) continue;
    const rel = uploadsPath(src);
    if (!rel) {
      problem(slug, `Dropped an image that wasn't in the media library: ${src}`);
      continue;
    }
    const file = await resolveUpload(rel);
    if (!file) {
      problem(slug, `Image missing from the uploads backup, dropped: ${rel}`);
      continue;
    }
    imageMap.set(src, {
      path: await copyImage(slug, file),
      fallbackAlt: humanize(path.basename(rel, path.extname(rel))),
    });
  }

  let markdown = makeTurndown(slug, imageMap).turndown(html);
  markdown = tidyBreaks(escapeMdx(normalizeSpaces(markdown)))
    .replace(/EMBEDTOKEN(\d+)/g, (_, index) => tokens[Number(index)])
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const words = plainText(markdown).split(" ").filter(Boolean).length;
  const firstImage = [...imageMap.values()][0];
  const firstVideo = /<YouTube id="([\w-]{11})"(?! short)/.exec(markdown)?.[1] ?? null;
  const anyVideo = /<YouTube id="([\w-]{11})"/.exec(markdown)?.[1] ?? null;

  const categories = (item.category ?? [])
    .filter((category) => category["@_domain"] === "category")
    .map((category) => decodeEntities(text(category)).trim())
    .filter((name) => name !== "Uncategorized")
    .map((name) => CATEGORY_ALIASES[name] ?? name);
  const category = CATEGORY_OVERRIDES[slug] ?? categories[0] ?? "Lifestyle";

  const frontmatter = {
    title,
    slug,
    date,
    category,
    excerpt: excerptFrom(markdown),
    cover: firstImage?.path ?? (anyVideo ? await youtubeThumbnail(anyVideo) : null),
    coverAlt: firstImage ? firstImage.fallbackAlt : title,
    readTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    ...(firstVideo ? { youtubeId: firstVideo } : {}),
    ...(products.length > 0 ? { products } : {}),
  };
  if (!frontmatter.cover) problem(slug, "No image or video for a cover.");

  await writeFile(
    path.join(CONTENT_DIR, `${slug}.mdx`),
    `---\n${YAML.stringify(frontmatter, { lineWidth: 0 })}---\n\n${markdown}\n`,
  );

  report.posts.push({ slug, title, date, category, images: imageMap.size, products: products.length, words });
  report.redirects.push({ source: `/${slug}`, destination: `/lifestyle/${slug}` });
}

console.log(JSON.stringify(report, null, 2));

/*
 * Drafts a review post from a YouTube video:
 *
 *   npm run review:new -- https://www.youtube.com/watch?v=VIDEO_ID
 *
 * Writes content/blog/<slug>.mdx with draft: true and disclosure: unclear,
 * prefilled with the video's title, date, chapters and every product link in
 * the description, and saves the thumbnail as public/blog/<slug>/cover.webp.
 * The body is a section outline with the description in a comment: write it
 * from the transcript before publishing. Shorts get the Quick Review outline.
 *
 * Product links come from the description and nowhere else (Amazon rules).
 * Amazon short links that carry a different tracking ID are swapped for the
 * product's own amazon.com link with ours (AMAZON_ASSOCIATE_TAG in lib/site.ts).
 * Needs YOUTUBE_API_KEY, read from the environment or .env.local.
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import YAML from "yaml";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");

const STOREFRONT = /amazon\.com\/shop\//i;
const SKIP_HOSTS = [
  "youtube.com", "youtu.be", "tiktok.com", "instagram.com", "twitch.tv", "discord.gg", "discord.com",
  "facebook.com", "x.com", "twitter.com", "superzydanofficial.com", "shopltk.com", "linktr.ee",
];
const SHORTENERS = ["geni.us", "urlgeni.us", "amzn.to", "link.amazon", "a.co", "bit.ly"];

/* First match wins, so the narrow categories come before the broad ones. */
const CATEGORY_KEYWORDS = [
  ["Keyboards", /keyboard|switches|keycap/i],
  ["Mice & Mousepads", /\bmouse\b|mouse ?pad|desk mat/i],
  ["Controllers", /controller|gamepad/i],
  ["Audio", /headset|headphone|earbud|airpods|ear tips|microphone|\bmic\b|lavalier|speaker/i],
  ["Cameras & Lighting", /webcam|camera|tripod|ring light|softbox|green screen|key light|light stand|cam link|osmo|gimbal|\bdji\b|video light/i],
  ["Pets", /\bcats?\b|kitty|kitten|litter|\bdog\b|\bpet\b|scratch/i],
  ["Kitchen", /knife|knives|\bpans?\b|air fryer|instant pot|blender|kitchen|grinder|thermometer|cutting board|keurig|coffee|microwave|mortar|chopper|sharpener|bowl|vacuum sealer|ricer|masher|roasting|burger press/i],
  ["Food & Drink", /candy|snack|protein bar|protein shake|ramen|seasoning|\bsalt\b|hot pot|curry|chocolate|whiskey/i],
  ["Fitness", /weight|bench|kettlebell|lifting|\bgym\b|workout|treadmill|walking pad|dip belt|calisthenics|wobble board|barbell/i],
  ["Home", /vacuum|smart lock|thermostat|\bfan\b|heater|fireplace|curtain lights|floor lamp|mattress pad|blanket|umbrella/i],
  ["Creator Tools", /extension|amazon influencer|broken link/i],
  ["Car", /\bcar\b|bmw|jeep|license plate|detailer|buffer|polisher|clay bar|valve caps|cup holder|tow hook/i],
  ["Tech", /charger|power bank|power strip|cable|\busb\b|ipad|monitor|motherboard|smart lock|thermostat|vacuum|stream deck|airtag|find my|photo frame/i],
  ["Kids & Toys", /\bkids\b|\btoy\b|lego|marble run|board game|card game|graphic novel|puzzle|fidget/i],
  ["Fashion", /sneaker|shoes|heels|sweater|hoodie|\bcoat\b|tank top|\bbelt\b|backpack|\bbag\b|umbrella/i],
  ["Health & Beauty", /\bhair\b|\bskin\b|pomade|razor|\bnail|tweezers|probiotic|magnesium|omega|massager|cpap|resmed|contact solution/i],
];

function fail(message) {
  console.error(`review:new: ${message}`);
  process.exit(1);
}

function videoIdFrom(input) {
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (url.hostname === "youtu.be") return url.pathname.slice(1, 12);
    const fromPath = /\/(?:shorts|live|embed)\/([\w-]{11})/.exec(url.pathname)?.[1];
    return fromPath ?? url.searchParams.get("v");
  } catch {
    return null;
  }
}

async function apiKey() {
  if (process.env.YOUTUBE_API_KEY) return process.env.YOUTUBE_API_KEY;
  try {
    const env = await readFile(path.join(ROOT, ".env.local"), "utf8");
    return /^YOUTUBE_API_KEY=(.+)$/m.exec(env)?.[1].trim() || null;
  } catch {
    return null;
  }
}

async function siteSetting(name) {
  const site = await readFile(path.join(ROOT, "lib", "site.ts"), "utf8");
  return new RegExp(`${name} = "([^"]+)"`).exec(site)?.[1] ?? null;
}

/* YouTube answers /shorts/<id> with 200 for a Short and a redirect to /watch for anything else. */
async function isShort(id) {
  const response = await fetch(`https://www.youtube.com/shorts/${id}`, { method: "HEAD", redirect: "manual" });
  return response.status === 200;
}

function host(url) {
  return new URL(url).hostname.replace(/^www\./, "");
}

function matchesHost(url, domains) {
  const h = host(url);
  return domains.some((domain) => h === domain || h.endsWith(`.${domain}`));
}

function isAmazonHost(h) {
  return h === "amazon.com" || h.endsWith(".amazon.com");
}

/*
 * Follows geni.us and friends to learn where they land. Keeps the owner's link
 * when it lands on Amazon with our tag; otherwise swaps in the product's own
 * amazon.com link with our tag. geni.us rate-limits, so 429s are retried.
 */
async function resolveProductLink(url, tag, warnings) {
  if (!matchesHost(url, SHORTENERS) && !isAmazonHost(host(url))) return { url };
  let landed = url;
  if (matchesHost(url, SHORTENERS)) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const response = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } });
        if (response.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 3000 * (attempt + 1)));
          continue;
        }
        landed = response.url;
      } catch {
        // Unreachable right now; checked below.
      }
      break;
    }
  }
  if (landed === url && matchesHost(url, SHORTENERS)) {
    warnings.push(`couldn't resolve ${url}; check it goes to the right product with tag ${tag}`);
    return { url };
  }
  const target = new URL(landed);
  if (!isAmazonHost(host(landed))) return { url };
  if (target.searchParams.get("tag") === tag) return isAmazonHost(host(url)) ? { url } : { url, store: "Amazon" };
  const asin = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/.exec(target.pathname)?.[1];
  if (!asin) {
    warnings.push(`${url} goes to Amazon without a product page; fix it by hand`);
    return { url, store: "Amazon" };
  }
  const fixed = `https://www.amazon.com/dp/${asin}?tag=${tag}`;
  if (fixed !== url) warnings.push(`${url} used tracking ID "${target.searchParams.get("tag")}"; swapped for ${fixed}`);
  return { url: fixed };
}

function stripSymbols(text) {
  return text.replace(/[^\p{L}\p{N}\s&'.,()+/-]/gu, " ").replace(/\s+/g, " ").trim();
}

function productName(label) {
  const name = stripSymbols(label)
    .replace(/^(?:check out|buy|get|grab|shop|purchase|order)\s+(?:the|my|yours|it)?\s*/i, "")
    .replace(/\s+(?:on amazon|here|below|at)$/i, "")
    .replace(/[\s:|-]+$/, "")
    .trim();
  return /^(?:product )?links?$|^$/i.test(name) ? null : name;
}

async function parseProducts(lines, tag, warnings) {
  const products = [];
  const seen = new Set();
  for (const [index, line] of lines.entries()) {
    for (const url of line.match(/https?:\/\/[^\s)]+/g) ?? []) {
      if (seen.has(url) || STOREFRONT.test(url) || matchesHost(url, SKIP_HOSTS)) continue;
      seen.add(url);
      const label = line.slice(0, line.indexOf(url));
      const name = productName(label) ?? productName(lines[index - 1] ?? "");
      const link = await resolveProductLink(url, tag, warnings);
      products.push({ name: name ?? "TODO: name this product", ...link });
    }
  }
  return products;
}

function parseChapters(lines) {
  return lines.flatMap((line) => {
    const match = /^\s*((?:\d{1,2}:)?\d{1,2}:\d{2})\s*[-:|\p{Pd}]?\s*(.+)$/u.exec(line);
    if (!match) return [];
    const seconds = match[1].split(":").reduce((total, part) => total * 60 + Number(part), 0);
    return [{ time: match[1].replace(/^0(\d:)/, "$1"), seconds, title: match[2].trim(), line }];
  });
}

const BOILERPLATE =
  /https?:\/\/|affiliate|amazon associate|commission|like and subscribe|don't forget to|storefront|timestamps?:|product links?:|^#/i;

function proseParagraphs(description, chapters) {
  const chapterLines = new Set(chapters.map((chapter) => chapter.line));
  return description
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split("\n")
        .filter((line) => !BOILERPLATE.test(line) && !chapterLines.has(line))
        .join("\n")
        .trim(),
    )
    .filter((block) => stripSymbols(block) && !/^(?:#\S+\s*)+$/.test(block));
}

/* MDX reads { } < as code, so escape them in text taken from YouTube. */
function escapeMdx(text) {
  return text.replace(/[{}]/g, (c) => `\\${c}`).replace(/</g, "&lt;");
}

function cleanText(text) {
  const invisible = new RegExp(
    `[${[0x200b, 0x200c, 0x200d, 0x2060, 0xfeff, 0x00ad].map((cp) => String.fromCodePoint(cp)).join("")}]`,
    "g",
  );
  const nbsp = new RegExp(`[${[0x00a0, 0x202f, 0x2007].map((cp) => String.fromCodePoint(cp)).join("")}]`, "g");
  return text.replace(invisible, "").replace(nbsp, " ").replace(/\r\n/g, "\n");
}

function excerptFrom(paragraphs, title) {
  const first = paragraphs.find((paragraph) => paragraph.length > 40 && !/^\s*-/m.test(paragraph)) ?? title;
  const flat = stripSymbols(first.replace(/\n/g, " "));
  if (flat.length <= 200) return flat;
  const cut = flat.slice(0, 200);
  const end = cut.lastIndexOf(". ");
  return end > 80 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}...`;
}

/* Short, readable slugs: "Eryntix Weight Bench Review: Full Assembly" keeps the part before the colon. */
function slugify(title) {
  const lead = title.split(/\s*[:|(]\s*/)[0];
  const words = (lead.trim().split(/\s+/).length >= 3 ? lead : title)
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean);
  let slug = "";
  for (const word of words) {
    if (slug && `${slug}-${word}`.length > 60) break;
    slug = slug ? `${slug}-${word}` : word;
  }
  return slug;
}

async function existingPosts() {
  const files = (await readdir(BLOG_DIR)).filter((file) => file.endsWith(".mdx"));
  return Promise.all(
    files.map(async (file) => ({ file, raw: await readFile(path.join(BLOG_DIR, file), "utf8") })),
  );
}

async function saveCover(id, slug) {
  for (const size of ["maxresdefault", "sddefault", "hqdefault"]) {
    const response = await fetch(`https://i.ytimg.com/vi/${id}/${size}.jpg`);
    if (!response.ok) continue;
    const dir = path.join(ROOT, "public", "blog", slug);
    await mkdir(dir, { recursive: true });
    await sharp(Buffer.from(await response.arrayBuffer()))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(dir, "cover.webp"));
    return `/blog/${slug}/cover.webp`;
  }
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

async function main() {
  const input = process.argv[2];
  if (!input) fail("usage: npm run review:new -- <youtube-url>");
  const id = videoIdFrom(input);
  if (!id) fail(`can't find a video ID in ${input}`);

  const key = await apiKey();
  if (!key) fail("YOUTUBE_API_KEY isn't set (environment or .env.local)");

  const posts = await existingPosts();
  const taken = posts.find((post) => new RegExp(`^youtubeId:\\s*["']?${id}["']?\\s*$`, "m").test(post.raw));
  if (taken) fail(`content/blog/${taken.file} already covers this video`);

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${key}`);
  if (!response.ok) fail(`YouTube API answered ${response.status}`);
  const video = (await response.json()).items?.[0]?.snippet;
  if (!video) fail(`no video found for ${id}`);

  const warnings = [];
  const tag = await siteSetting("AMAZON_ASSOCIATE_TAG");
  if (!tag) fail("AMAZON_ASSOCIATE_TAG isn't set in lib/site.ts");
  if (video.channelId !== (await siteSetting("REVIEWS_YOUTUBE_CHANNEL_ID"))) {
    warnings.push(`this video is from "${video.channelTitle}", not the reviews channel`);
  }

  const title = cleanText(video.title).trim();
  const description = cleanText(video.description ?? "");
  const lines = description.split("\n");

  let slug = slugify(title);
  for (let n = 2; existsSync(path.join(BLOG_DIR, `${slug}.mdx`)); n++) slug = `${slugify(title)}-${n}`;

  const short = await isShort(id);
  const products = await parseProducts(lines, tag, warnings);
  const chapters = parseChapters(lines);
  const paragraphs = proseParagraphs(description, chapters);
  const productCategory =
    CATEGORY_KEYWORDS.find(([, pattern]) => pattern.test(`${title} ${(video.tags ?? []).join(" ")}`))?.[0] ?? "Other";
  const cover = await saveCover(id, slug);

  if (products.length === 0) warnings.push("no product links in the description; add them by hand or leave products out");
  for (const product of products) {
    if (product.name.startsWith("TODO")) warnings.push(`name the product for ${product.url}`);
  }

  const frontmatter = {
    title,
    slug,
    date: video.publishedAt.slice(0, 10),
    category: "Reviews",
    productCategory,
    excerpt: excerptFrom(paragraphs, title),
    cover,
    coverAlt: `Thumbnail from the video: ${title}`,
    youtubeId: id,
    ...(short ? { short: true } : {}),
    disclosure: "unclear",
    draft: true,
    ...(products.length ? { products } : {}),
  };

  // The description stays in a comment for reference; the post itself is written from the transcript.
  const reference = paragraphs.join("\n\n").replace(/\*\//g, "* /");
  const outline = short
    ? ["## My take", "## Key specs", "## Who it's for"]
    : ["## My take", "## What I liked", "## Heads up", "## Key specs", "## Who it's for"];
  const body = [
    "{/* DRAFT: write each section from the transcript in the owner's words, then set disclosure and draft: false. */}",
    reference ? `{/* From the video description:\n\n${reference}\n*/}` : "",
    ...outline.map((heading) => `${heading}\n\nTODO`),
    ...(chapters.length
      ? [
          "## What's in the video",
          chapters
            .map(
              (chapter) =>
                `- [${chapter.time}](https://www.youtube.com/watch?v=${id}&t=${chapter.seconds}s) ${escapeMdx(chapter.title)}`,
            )
            .join("\n"),
        ]
      : []),
  ]
    .filter(Boolean)
    .join("\n\n");

  await writeFile(
    path.join(BLOG_DIR, `${slug}.mdx`),
    `---\n${YAML.stringify(frontmatter, { lineWidth: 0 })}---\n\n${body}\n`,
  );

  console.log(`Wrote content/blog/${slug}.mdx (draft)`);
  console.log(`  ${short ? "Short" : "Video"} from ${frontmatter.date}, guessed category: ${productCategory}`);
  console.log(`  ${products.length} product link(s), ${chapters.length} chapter(s), cover: ${cover}`);
  for (const warning of warnings) console.log(`  check: ${warning}`);
  console.log(`  Next: write the body. The transcript is under "...more" > "Show transcript" on the video page.`);
}

await main();

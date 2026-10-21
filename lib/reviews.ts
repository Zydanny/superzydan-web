import type { VlogPost } from "@/lib/site";

/*
 * Shared facts about the FNP75 review for the setup and product-review pages.
 * The write-up itself lives in content/blog/gateron-sikakeyb-fnp75-he.mdx.
 */

export const KEYBOARD_REVIEW_SLUG = "gateron-sikakeyb-fnp75-he";
export const KEYBOARD_REVIEW_PATH = `/lifestyle/${KEYBOARD_REVIEW_SLUG}`;
export const KEYBOARD_PRODUCT_URL =
  "https://www.gateron.com/products/gateron-%C3%97-sikakeyb-fnp75-he-magnetic-switch-custom-gaming-keyboard?VariantsId=11581";
export const KEYBOARD_YOUTUBE_URL = "https://www.youtube.com/watch?v=ZHqjBrN4cFA";
export const KEYBOARD_YOUTUBE_ID = "ZHqjBrN4cFA";
export const KEYBOARD_THUMB = "/images/gateron-sikakeyb-fnp75-he.jpg";

export const keyboardReview = {
  title: "Gateron × SIKAKEYB FNP75 HE: I upgraded to a Hall Effect board",
  excerpt:
    "Not a TikTok-shop keyboard. I researched Wooting, Keychron, Gravistar, and MelGeek, then bought the red Gateron × SIKAKEYB FNP75 HE myself — and swapped in Magnetic Jade Ultras to hear if $70 extra actually matters.",
  tag: "Electronics",
  thumbnail: KEYBOARD_THUMB,
  youtubeId: KEYBOARD_YOUTUBE_ID,
  youtubeUrl: KEYBOARD_YOUTUBE_URL,
  productUrl: KEYBOARD_PRODUCT_URL,
  productName: "Gateron × SIKAKEYB FNP75 HE",
  color: "Red",
  path: KEYBOARD_REVIEW_PATH,
  specs: [
    "75% Hall Effect",
    "USB-C wired, 8K polling",
    "Rapid Trigger + adjustable actuation",
    "Patented triple / split spacebar",
    "Aluminum case — 1,720g",
    "Stock: Gateron Delta / Delta Light on WASD",
    "Current: Magnetic Jade Ultra",
    "Hot-swap",
    "Carry case included",
  ],
  setupBlurb:
    "The daily driver now. Red 75% Hall Effect from Gateron × SIKAKEYB — Rapid Trigger, a triple spacebar, and Magnetic Jade Ultra switches after I swapped the stock Deltas. Not sponsored. I bought this one myself.",
} as const;

export const keyboardReviewPost: VlogPost = {
  title: keyboardReview.title,
  excerpt: keyboardReview.excerpt,
  tag: keyboardReview.tag,
  readTime: 5,
  status: "Published",
  thumbnail: KEYBOARD_THUMB,
  url: KEYBOARD_REVIEW_PATH,
  internal: true,
};

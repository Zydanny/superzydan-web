import type { VlogPost } from "@/lib/site";

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

export const keyboardReviewBody = [
  "It was time to make the upgrade to a Hall Effect keyboard. I did a ton of research to find the right one — this is not your average TikTok-shop board, and nobody sponsored me. I looked at Wooting, Keychron, Gravistar, MelGeek, and a pile of others. When I landed on the Gateron collaboration with SIKAKEYB, it was just… that’s the one.",
  "I bought the Gateron × SIKAKEYB FNP75 HE myself. It comes in red, orange, and gold. Guess which one I picked.",
  "The box is heavy, which is a good sign. It ships in a real carry case, and the board has a built-in incline so you don’t have to fake a tent. Aluminum case, 75% layout, USB-C, 8K polling, Rapid Trigger, and adjustable actuation — the Hall Effect stuff that actually matters for sweaty games. SIKAKEYB is known for the triple spacebar, and this one has it: three independent switches instead of one wobbly bar.",
  "Stock it came with Gateron Delta switches. WASD and the stabilized keys use Delta Light; the rest of the board is custom themed to the color you pick, so mine are red. It already sounded good out of the box. Hot-swap, Gateron badge, a little crystal / dragon-heart emblem on the side that lights up. The included cable is a basic black USB-C — fine, but it is not surviving on a red desk. That one’s getting swapped.",
  "I still wanted the best, so I bought an extra set: Gateron Magnetic Jade Ultra, about $70 more. I was chasing that deeper, dockier mahjong sound. First I swapped four keys and compared WASD to JKL;. Barely a difference. Then I learned the WASD Deltas are a different SKU than the rest of the board, which explained some of the confusion — and I still couldn’t tell them apart. I almost shipped the Ultras back.",
  "For the love of the game I replaced every letter and the spacebar anyway. That’s when it clicked. Full board of Jade Ultras is a little deeper, a tiny bit more clicky. Not night and day. Was it worth $70? Maybe, in the end. I kept them.",
  "If you want Hall Effect without guessing from a random shop listing, this is the board on my desk. Watch the unboxing and the switch tests, then grab the FNP75 HE if it looks like your color.",
] as const;

export function mergeLifestylePosts(posts: VlogPost[]): VlogPost[] {
  const withoutDup = posts.filter((post) => post.url !== KEYBOARD_REVIEW_PATH);
  return [keyboardReviewPost, ...withoutDup];
}

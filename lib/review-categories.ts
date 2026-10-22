/*
 * One page per review product category, at /product-reviews/<slug>. The keys
 * are the `productCategory` values used in content/blog. A review with a
 * category that isn't listed here still shows on Product Reviews; it just has
 * no category page until it gets an entry.
 *
 * `title` is the whole search-result title (under 60 characters) and
 * `description` the snippet (under 155). `intro` is the line under the page
 * heading.
 */
export type ReviewCategory = {
  slug: string;
  label: string;
  /** Short plural name for the page heading, e.g. "Keyboards". */
  heading: string;
  title: string;
  description: string;
  intro: string;
};

export const REVIEW_CATEGORIES: Record<string, ReviewCategory> = {
  Keyboards: {
    slug: "keyboards",
    label: "Keyboards",
    heading: "Keyboards",
    title: "Keyboard Reviews: Hall Effect and Mechanical | SuperZydan",
    description:
      "Hall Effect, mechanical and wireless keyboards I've actually typed and gamed on, from the FNP75 HE to budget boards. Video reviews, pros and cons.",
    intro: "Hall Effect boards, budget mechanicals and one that's basically art. Every one of these has been on my desk.",
  },
  Controllers: {
    slug: "controllers",
    label: "Controllers",
    heading: "Controllers",
    title: "Controller Reviews: PC and Console Gamepads | SuperZydan",
    description:
      "PC and console controllers I've tested in real games, from SCUF to GameSir. Triggers, sticks, extra buttons and whether they're worth it.",
    intro: "Pads I've played real games with, side by side with the ones I already had.",
  },
  Audio: {
    slug: "audio",
    label: "Audio",
    heading: "Audio",
    title: "Audio Gear Reviews: Mics and Gaming Headsets | SuperZydan",
    description:
      "Wireless mics and gaming headsets I use for streams and videos, like the Hollyland Lark M2 and HyperX Cloud Alpha. How they sound and feel.",
    intro: "What I clip on, plug in and wear when the camera's rolling.",
  },
  "Creator Tools": {
    slug: "creator-tools",
    label: "Creator Tools",
    heading: "Creator Tools",
    title: "Creator Tool Reviews: Stream Deck and More | SuperZydan",
    description:
      "Tools I use to run streams and make content, from the Elgato Stream Deck MK.2 to the Amazon link checker extension I built myself.",
    intro: "The behind-the-scenes stuff that makes streaming and posting easier.",
  },
  "Cameras & Lighting": {
    slug: "cameras-lighting",
    label: "Cameras & Lighting",
    heading: "Cameras and Lighting",
    title: "Camera and Lighting Reviews for Creators | SuperZydan",
    description:
      "Tripods, phone mounts and lights I use to shoot content, tested on real videos. What's quick to set up and what actually stays put.",
    intro: "Mounts and lights I shoot with, tested on real videos.",
  },
  Tech: {
    slug: "tech",
    label: "Tech",
    heading: "Tech",
    title: "Tech Gadget Reviews: Power Banks and More | SuperZydan",
    description:
      "Gadgets I carry and use every day, like the Anker 165W laptop power bank. Unboxings, real use and what I'd change.",
    intro: "Gadgets that live in my bag and on my desk.",
  },
  Kitchen: {
    slug: "kitchen",
    label: "Kitchen",
    heading: "Kitchen",
    title: "Kitchen Gadget Reviews: Pans, Tools and More | SuperZydan",
    description:
      "HexClad pans, a Keurig, a veggie chopper, a meat thermometer and more, tested while actually cooking. What works in my kitchen and what doesn't.",
    intro: "Pans, gadgets and tools I cook with for real, not just unbox.",
  },
  Home: {
    slug: "home",
    label: "Home",
    heading: "Home",
    title: "Home Product Reviews: Vacuums, Fans, Lights | SuperZydan",
    description:
      "Vacuums, fans, smart lights and a gaming chair, set up and used at home. Assembly, features and whether I'd buy them again.",
    intro: "Stuff we set up and use around the house every day.",
  },
  Fitness: {
    slug: "fitness",
    label: "Fitness",
    heading: "Fitness",
    title: "Fitness Gear Reviews: Benches, Hooks and More | SuperZydan",
    description:
      "Gym gear I've trained with: an adjustable weight bench, lifting hooks, a walking pad and an electric ball pump. Real workouts, honest takes.",
    intro: "Gear I've actually sweated on.",
  },
  Car: {
    slug: "car",
    label: "Car",
    heading: "Car Care",
    title: "Car Care Product Reviews: Detailing and Paint | SuperZydan",
    description:
      "Detail spray, a cordless buffer and touch-up paint, tested on our own cars. What made a real difference and what to expect.",
    intro: "Detailing and touch-up stuff, tested on our own cars.",
  },
  Pets: {
    slug: "pets",
    label: "Pets",
    heading: "Pets",
    title: "Pet Product Reviews: Litter Boxes and Cat Trees | SuperZydan",
    description:
      "Automatic litter boxes and cat trees tested with our cats, Zeus the big Siberian included. Setup, size and which one fits which cat.",
    intro: "Tested by our cats, who are much harder to impress than I am.",
  },
  Fashion: {
    slug: "fashion",
    label: "Fashion",
    heading: "Fashion",
    title: "Fashion Reviews: Belts and Everyday Wear | SuperZydan",
    description:
      "Clothes and accessories I actually wear, like the BULLIANT ratchet belt. Unboxings and first impressions.",
    intro: "Things I actually wear, not just try on for a video.",
  },
  "Health & Beauty": {
    slug: "health-beauty",
    label: "Health & Beauty",
    heading: "Health and Beauty",
    title: "Health and Beauty Product Reviews | SuperZydan",
    description:
      "Everyday health and personal care stuff we use at home, like Clear Care contact solution, and what to know before you try it.",
    intro: "Everyday stuff from our bathroom shelf, and what to know first.",
  },
  "Kids & Toys": {
    slug: "kids-toys",
    label: "Kids & Toys",
    heading: "Family Games",
    title: "Family Game and Toy Reviews | SuperZydan",
    description:
      "Card games and toys we play as a family, with the best moments from our game nights and who actually won.",
    intro: "Game night picks, tested by the whole family.",
  },
};

export function reviewCategory(productCategory: string | undefined): ReviewCategory | null {
  return productCategory ? (REVIEW_CATEGORIES[productCategory] ?? null) : null;
}

export function reviewCategoryBySlug(slug: string): ReviewCategory | null {
  return Object.values(REVIEW_CATEGORIES).find((category) => category.slug === slug) ?? null;
}

export function reviewCategoryPath(category: ReviewCategory) {
  return `/product-reviews/${category.slug}`;
}

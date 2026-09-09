import { affiliateDisclosure } from "@/lib/site";
import {
  KEYBOARD_PRODUCT_URL,
  KEYBOARD_REVIEW_PATH,
  KEYBOARD_THUMB,
  KEYBOARD_YOUTUBE_URL,
  keyboardReview,
} from "@/lib/reviews";

export const STOREFRONT_URL = "https://www.amazon.com/shop/superzydan";

export const aboutPage = {
  eyebrow: "About Us",
  title: "SuperZydan and LinkNova",
  tagline: "Chaotic Gaming, Cooking & Collabs — buckle up for the Zyverse.",
  badges: ["Father-Son Duo", "Tactical Gaming & Gear", "Roblox & Co-op"],
  image: {
    src: "/images/superzydan-linknova.jpg",
    alt: "SuperZydan and LinkNova",
  },
  intro: [
    "Welcome to SuperZydanOfficial.com — your hub for chaotic gaming, epic dad-son adventures, and a whole lot of fun.",
    "What started as a father-son gaming duo — Roblox, Minecraft, and Nintendo Switch by day — has evolved into a full-blown entertainment brand. Nights go hard: Elden Ring, Bloodborne, Cyberpunk 2077, spicy cooking experiments, gym grind, tech reviews, and skits with LinkNova.",
  ],
  pillars: [
    {
      title: "Gaming for everyone",
      blurb:
        "Two-player chaos by day, sweaty streams by night. Looking at you, Sekiro rage quits.",
    },
    {
      title: "Cooking with chaos",
      blurb: "No measuring, just memories — and the occasional smoke alarm. No rules, just flavor.",
    },
    {
      title: "Gym and lifestyle",
      blurb: "Gains, fails, and the occasional protein-shake disaster.",
    },
    {
      title: "Fashion and brands",
      blurb: "JNCO jeans, collabs, and “he’s a grown man, why is he wearing that!?”",
    },
    {
      title: "Comedy gold",
      blurb: "Dad jokes, pranks, and very questionable life choices.",
    },
  ],
  manifesto: {
    title: "Turning passion into play, and play into art",
    belief: "Creativity thrives where fun and curiosity collide.",
    points: [
      "Remix the expected — games become canvases, glitches become features, and failures become the best stories.",
      "Celebrate the process — from rough drafts to polished moments, we share the messy, magical journey.",
      "Build together — whether it’s with each other or the community, collaboration is the favorite power-up.",
    ],
    closer:
      "Play isn’t just entertainment — it’s how we rediscover wonder, solve problems sideways, and connect in ways that straight lines never allow. Stay curious. Stay silly. The rest will follow.",
  },
  timeline: [
    { year: "Day one", title: "Father-son duo", blurb: "Roblox, Minecraft, and Switch sessions that turned into a channel." },
    { year: "After dark", title: "The night shift", blurb: "Elden Ring, Bloodborne, Cyberpunk, and the sweaty tactical queue." },
    { year: "Off-desk", title: "Kitchen and gym", blurb: "Recipe chaos, workout vlogs, and the occasional smoke alarm." },
    { year: "2025", title: "DreamHack Dallas", blurb: "Live from the floor — the brand showed up in person." },
  ],
  team: [
    { name: "Kian", role: "Founder / all channels", blurb: "Very handsome fellow. Best weird Roblox avatar creator." },
    { name: "NoSkillBrad", role: "Moderator / Twitch", blurb: "Australia. Jelly-filled donuts." },
    { name: "GOJO / KJ", role: "Moderator / TikTok", blurb: "Has to carry him in Fortnite." },
  ],
  collab:
    "Wanna join the chaos? Whether you’re a fellow streamer, a dev with a wild game idea, or just someone who can out-rizz SuperZydan — hit the contact page. Collabs are our favorite cheat code. Warning: may involve spontaneous dance-offs or pixel-art battles. No regrets.",
} as const;

export type SetupItem = {
  title: string;
  subtitle: string;
  blurb: string;
  specs: string[];
  badges: string[];
  href: string;
  cta: string;
  wide?: boolean;
};

export type SetupProduct = {
  /** Used for homepage deep-links like `/setup#wave-3`. */
  id?: string;
  label?: string;
  name: string;
  href?: string;
  note?: string;
};

export type SetupCategory = {
  id?: string;
  title: string;
  blurb?: string;
  products: SetupProduct[];
};

export type SetupGroup = {
  categories: SetupCategory[];
  photo?: {
    src: string;
    alt: string;
  };
};

export const setupIntro =
  "The battlestation behind the streams — every part on the desk, with a shop link on each one. Purchasing through the links below supports the channel at no extra cost to you.";

const setupPhotos = {
  pc1: {
    src: "https://superzydanofficial.com/wp-content/uploads/2025/05/PC-1-1024x768.jpg",
    alt: "Custom PC build, angle one",
  },
  pc2: {
    src: "https://superzydanofficial.com/wp-content/uploads/2025/05/PC-2-1024x768.jpg",
    alt: "Custom PC build, angle two",
  },
  desk: {
    src: "https://superzydanofficial.com/wp-content/uploads/2025/05/IMG_0598-1024x768.jpg",
    alt: "Desk setup",
  },
  keyboard: {
    src: KEYBOARD_THUMB,
    alt: "Gateron × SIKAKEYB FNP75 HE unboxing thumbnail",
  },
} as const;

export const setupGroups: SetupGroup[] = [
  {
    photo: setupPhotos.pc1,
    categories: [
      {
        id: "gaming-pc",
        title: "Gaming PC",
        products: [
          { label: "GPU", name: "NVIDIA RTX 4090 AERO", href: "https://amzn.to/4iW9FTB" },
          { label: "Motherboard", name: "GIGABYTE Z790 AORUS PRO", href: "https://amzn.to/4daYqpc" },
          { label: "RAM", name: "64 GB G.Skill Trident DDR5 (2x32GB) 6000 C36", href: "https://amzn.to/4mdAG7W" },
          { label: "CPU", name: "Intel i9-13900K", href: "https://amzn.to/3YH2wQ5" },
          { label: "PSU", name: "MSI MPG A1000G 80+G", href: "https://amzn.to/4kfGKef" },
          { label: "SSD", name: "Samsung 990 PRO 2TB NVMe Gen 4", href: "https://amzn.to/43tBKNy" },
          { label: "Case", name: "Lian Li O11 Vision White", href: "https://amzn.to/4djosqq" },
          { label: "CPU Cooler", name: "Lian Li GA II Trinity 360 White", href: "https://amzn.to/3SzVJE4" },
          { label: "Fans", name: "Lian Li UNI SL Infinity", href: "https://www.amazon.com/s?k=Lian+Li+UNI+SL+Infinity" },
          { label: "Cables", name: "Lian Li Strimer Plus 24 Pin", href: "https://amzn.to/4miHXDG" },
          { name: "Lian Li Strimer Plus V2", href: "https://amzn.to/3YFsqUd" },
        ],
      },
    ],
  },
  {
    photo: setupPhotos.keyboard,
    categories: [
      {
        id: "keyboard",
        title: "Keyboard",
        blurb: keyboardReview.setupBlurb,
        products: [
          { name: keyboardReview.productName, href: KEYBOARD_PRODUCT_URL },
          { label: "Color", name: "Red" },
          { label: "Layout", name: "75% Hall Effect" },
          { label: "Stock switches", name: "Gateron Delta / Delta Light on WASD" },
          { label: "Current switches", name: "Gateron Magnetic Jade Ultra" },
          { label: "Watch", name: "YouTube unboxing and switch test", href: KEYBOARD_YOUTUBE_URL },
          { label: "Read", name: "Full review", href: KEYBOARD_REVIEW_PATH },
        ],
      },
    ],
  },
  {
    photo: setupPhotos.pc2,
    categories: [
      {
        id: "accessories",
        title: "Accessories",
        products: [
          { name: "Elgato Wave Mic Arm", href: "https://amzn.to/4jRvLYN" },
          { id: "wave-3", label: "Microphone", name: "Elgato Wave 3 White", href: "https://amzn.to/3YIOCwK" },
          { name: "Elgato Cam Link 4K", href: "https://amzn.to/4detJPO" },
          { id: "sony-a6000", label: "Camera", name: "Sony Alpha 6000 Mirrorless", href: "https://amzn.to/4iY9Fmg" },
          { label: "Lens", name: "Sigma 16mm f/1.4", href: "https://www.amazon.com/dp/B077BWD2BB" },
          { name: "Elgato Key Light", href: "https://amzn.to/4ddllQV" },
          { name: "Elgato Key Light Air", href: "https://www.amazon.com/dp/B07LDM7FD6" },
          { id: "stream-deck", name: "Elgato Stream Deck MK.2", href: "https://amzn.to/4jMgHeY" },
          { name: "Elgato 4K60 Pro MK.2", href: "https://amzn.to/42YDiPK" },
          { name: "Scuf Custom Gaming Controller", href: "https://amzn.to/4iWV0b3" },
          { name: "ULANZI Camera Desk Mount", href: "https://amzn.to/4kgMJzJ" },
          { label: "Mouse", name: "Razer DeathAdder V3 Pro Wireless", href: "https://amzn.to/3GSCiUu" },
          { id: "cloud-alpha", label: "Headphones", name: "HyperX Cloud Alpha", href: "https://www.amazon.com/s?k=HyperX+Cloud+Alpha" },
          { name: "WOOZOO Desk Fan", href: "https://amzn.to/4iSSMct" },
        ],
      },
    ],
  },
  {
    photo: setupPhotos.desk,
    categories: [
      {
        title: "Monitors",
        products: [
          { label: "Primary", name: "Samsung G7 32 inch", href: "https://amzn.to/42TUYfb" },
          { label: "Secondary", name: "Samsung G5 32 Inch", href: "https://amzn.to/3S2sjhN" },
        ],
      },
      {
        title: "Consoles",
        products: [
          { name: "PlayStation 5", href: "https://amzn.to/43lIbRU" },
          { name: "Nintendo Switch", href: "https://amzn.to/3GLM3UD", note: "and Switch 2" },
        ],
      },
    ],
  },
  {
    categories: [
      {
        title: "Previous keyboard",
        blurb: "The board that was on the desk before the Hall Effect upgrade.",
        products: [
          { name: "Glorious GMMK PRO", href: "https://amzn.to/4mcsWmP" },
          { name: "Gateron Milky Pro Switches", href: "https://amzn.to/3YDlOpp" },
          { name: "Polycarbonate Switch Plate" },
          { name: "Custom Keycaps from Goblin Tech Keys", href: "https://goblintechkeys.com/?ref=p8hHC0WDNtCKEx" },
        ],
      },
    ],
  },
];

export const setupItems: SetupItem[] = [
  {
    title: "Custom battlestation",
    subtitle: "Main PC",
    blurb: "The box that runs the tactical sessions, Roblox nights, and everything in between.",
    specs: [
      "Intel Core i9-13900K",
      "NVIDIA RTX 4090 AERO",
      "64 GB G.Skill Trident DDR5 6000",
      "GIGABYTE Z790 AORUS PRO",
      "Samsung 990 PRO 2TB",
      "MSI MPG A1000G",
      "Lian Li O11 Vision White",
    ],
    badges: ["Custom build"],
    href: "https://amzn.to/3YH2wQ5",
    cta: "Shop the CPU",
    wide: true,
  },
  {
    title: keyboardReview.productName,
    subtitle: "Hall Effect 75%",
    blurb: keyboardReview.setupBlurb,
    specs: [...keyboardReview.specs],
    badges: ["Hall Effect", "Rapid Trigger"],
    href: KEYBOARD_PRODUCT_URL,
    cta: "View the board",
  },
  {
    title: "Sony Alpha 6000",
    subtitle: "Camera",
    blurb: "Mirrorless body with a Sigma 16mm f/1.4 and an Elgato Cam Link 4K into the stream PC.",
    specs: ["Sony a6000", "Sigma 16mm f/1.4", "Elgato Cam Link 4K", "ULANZI desk mount"],
    badges: ["Camera"],
    href: "https://amzn.to/4iY9Fmg",
    cta: "View the camera",
  },
];

export const reviewsIntro =
  "I’m a gaming streamer, content creator, and tech enthusiast with a passion for custom PC builds and cutting-edge electronics. Whether you’re searching for top-tier gaming gear, streaming setups, or must-have gadgets, I’ve got you covered. My wife and I also share curated picks in household essentials, apparel, and kitchen appliances.";

export const reviewCategories = [
  { label: "Electronics", href: "/lifestyle?tag=Electronics", blurb: "Gadgets, audio, and creator tools I actually use." },
  { label: "Fashion", href: "/lifestyle", blurb: "JNCO, streetwear, and the outfits chat dunks on." },
  { label: "Home & Kitchen", href: "/lifestyle", blurb: "The pans, gadgets, and recipe chaos." },
  { label: "Health & Beauty", href: "/lifestyle", blurb: "Gym bag, recovery, and the stuff that survives the grind." },
  { label: "Sports & Fitness", href: "/lifestyle", blurb: "Sweat & Progress — the real-time fitness vlog." },
  { label: "Deals", href: STOREFRONT_URL, blurb: "Current storefront picks, collected in one place.", external: true },
] as const;

export const lifestyleIntro =
  "Reviews, recipes, and the back-to-school lists — pulled live from the blog.";

export const merchPage = {
  eyebrow: "Merch",
  title: "The drop is coming",
  blurb:
    "Official SuperZydan merch is still in the works. Until it lands, the Amazon storefront and LTK picks are the closest thing to a shop.",
} as const;

export const contactPage = {
  eyebrow: "Contact",
  title: "Say hey",
  blurb:
    "Feedback, questions, collabs, or just a good rizz-off challenge — message below or email the LLC directly.",
  company: "SuperZydan LLC",
  email: "superzydanofficial@gmail.com",
} as const;

export const privacyPage = {
  eyebrow: "Legal",
  title: "Privacy policy",
  updated: "May 13, 2025",
  intro:
    "Welcome to the SuperZydan official webpage. This policy explains how we collect, use, and protect your information when you visit the site, interact with content, or purchase merch. By using the site, you agree to this policy.",
  sections: [
    {
      title: "Information we collect",
      body: "Personal information via contact forms, newsletters, or merch sales (name, email, shipping address). Automated data through cookies and analytics (IP, browser, device, viewing behavior). Third-party data via embedded content, including Twitch chat and viewer stats.",
    },
    {
      title: "How we use your data",
      body: "To send newsletters if you subscribed, process merch orders, analyze traffic so the content gets better, and display embedded Twitch streams.",
    },
    {
      title: "Sharing and retention",
      body: "We do not sell your data. It is stored with the website host, payment processors such as PayPal, and analytics providers such as Google Analytics.",
    },
    {
      title: "Cookies and tracking",
      body: "Cookies track analytics, remember preferences such as member logins, and enable Twitch embeds. Continued use of the site implies agreement.",
    },
    {
      title: "Age restrictions",
      body: "Content is not intended for children under 13. We do not knowingly collect their data.",
    },
    {
      title: "Updates",
      body: "Changes will be posted here with a new Last Updated date. Continued use means you accept the revisions.",
    },
  ],
} as const;

export const communityPage = {
  eyebrow: "Community",
  title: "Join The Zyverse",
  blurb:
    "Stream pings, squad-finding, gear talk, and the chaos that never makes the VOD. One server. One click. Come hang out in the Discord.",
} as const;

export { affiliateDisclosure };

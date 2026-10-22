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
  story: [
    "I'm SuperZydan, a gamer dad. It started with my son LinkNova and me playing Roblox, Minecraft and Switch co-op, and hitting record because it was too funny not to.",
    "After bedtime it's my turn: Elden Ring, Bloodborne, Cyberpunk and Valorant, live on Twitch. Somewhere along the way the channel picked up gear reviews, kitchen experiments, gym vlogs and skits with LinkNova.",
    "No scripts and no fake hype. If I review something, I used it. If a recipe flops, you'll see that too.",
  ],
  pillars: [
    { title: "Gaming", blurb: "Two-player chaos by day, sweaty solo streams by night. Looking at you, Sekiro rage quits." },
    { title: "Cooking", blurb: "No measuring, just memories, and the occasional smoke alarm." },
    { title: "Gym", blurb: "Gains, fails, and the occasional protein-shake disaster." },
    { title: "Fashion", blurb: "JNCO jeans, collabs, and “he’s a grown man, why is he wearing that!?”" },
    { title: "Comedy", blurb: "Dad jokes, pranks, and very questionable life choices." },
  ],
  timeline: [
    { when: "Day one", title: "Father and son", blurb: "Roblox, Minecraft and Switch sessions that turned into a channel." },
    { when: "After dark", title: "The night shift", blurb: "Elden Ring, Bloodborne, Cyberpunk and the sweaty Valorant queue." },
    { when: "Off the desk", title: "Kitchen and gym", blurb: "Recipe chaos, workout vlogs and the occasional smoke alarm." },
    { when: "2025", title: "DreamHack Dallas", blurb: "Live from the show floor, in person." },
  ],
} as const;

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
  "Every part on my desk, with a shop link on each one. Same price for you, a little support for the channel.";

const setupPhotos = {
  desk: {
    src: "/images/setup/pc-build-1.webp",
    alt: "The full desk: two curved monitors, Elgato key lights, the white PC and a gaming chair",
  },
  pc: {
    src: "/images/setup/pc-build-2.webp",
    alt: "Inside the white Lian Li case: the RTX 4090 AERO, a white 360 cooler and Strimer cables glowing cyan",
  },
  oldKeyboard: {
    src: "/images/setup/desk-setup.webp",
    alt: "The previous keyboard: a 75% board with custom keycaps and a SUPERZYDAN spacebar",
  },
  keyboard: {
    src: KEYBOARD_THUMB,
    alt: "SuperZydan holding the boxed FNP75 HE next to the red keyboard",
  },
} as const;

export const setupHeroPhoto = setupPhotos.desk;
export const setupGroups: SetupGroup[] = [
  {
    photo: setupPhotos.pc,
    categories: [
      {
        id: "gaming-pc",
        title: "Gaming PC",
        products: [
          { label: "GPU", name: "NVIDIA RTX 4090 AERO", href: "https://www.amazon.com/s?k=nvidia+4090&tag=superzydan1-20" },
          { label: "Motherboard", name: "GIGABYTE Z790 AORUS PRO", href: "https://www.amazon.com/dp/B083RW9TJF?tag=superzydan1-20" },
          { label: "RAM", name: "64 GB G.Skill Trident DDR5 (2x32GB) 6000 C36", href: "https://www.amazon.com/dp/B0CBLCKQGV?tag=superzydan1-20" },
          { label: "CPU", name: "Intel i9-13900K", href: "https://www.amazon.com/dp/B0BCF54SR1?tag=superzydan1-20" },
          { label: "PSU", name: "MSI MPG A1000G 80+G", href: "https://www.amazon.com/dp/B0B434DB7Y?tag=superzydan1-20" },
          { label: "SSD", name: "Samsung 990 PRO 2TB NVMe Gen 4", href: "https://www.amazon.com/dp/B0BHJJ9Y77?tag=superzydan1-20" },
          { label: "Case", name: "Lian Li O11 Vision White", href: "https://www.amazon.com/s?k=lian+li+o11+vision+white&i=electronics&tag=superzydan1-20" },
          { label: "CPU Cooler", name: "Lian Li GA II Trinity 360 White", href: "https://www.amazon.com/dp/B0CDF6GYM1?tag=superzydan1-20" },
          { label: "Fans", name: "Lian Li UNI SL Infinity", href: "https://www.amazon.com/s?k=Lian+Li+UNI+SL+Infinity&tag=superzydan1-20" },
          { label: "Cables", name: "Lian Li Strimer Plus 24 Pin", href: "https://www.amazon.com/dp/B0DJVRVGS1?tag=superzydan1-20" },
          { name: "Lian Li Strimer Plus V2", href: "https://www.amazon.com/dp/B0DNNBY7VK?tag=superzydan1-20" },
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
    photo: setupPhotos.desk,
    categories: [
      {
        id: "accessories",
        title: "Accessories",
        products: [
          { name: "Elgato Wave Mic Arm", href: "https://www.amazon.com/dp/B097376LKF?tag=superzydan1-20" },
          { id: "wave-3", label: "Microphone", name: "Elgato Wave 3 White", href: "https://www.amazon.com/dp/B0B29DR8Z8?tag=superzydan1-20" },
          { name: "Elgato Cam Link 4K", href: "https://www.amazon.com/dp/B07K3FN5MR?tag=superzydan1-20" },
          { id: "sony-a6000", label: "Camera", name: "Sony Alpha 6000 Mirrorless", href: "https://www.amazon.com/dp/B00I8BICB2?tag=superzydan1-20" },
          { label: "Lens", name: "Sigma 16mm f/1.4", href: "https://www.amazon.com/dp/B077BWD2BB?tag=superzydan1-20" },
          { name: "Elgato Key Light", href: "https://www.amazon.com/dp/B07L755X9G?tag=superzydan1-20" },
          { name: "Elgato Key Light Air", href: "https://www.amazon.com/dp/B07LDM7FD6?tag=superzydan1-20" },
          { id: "stream-deck", name: "Elgato Stream Deck MK.2", href: "https://www.amazon.com/dp/B09RMXK59C?tag=superzydan1-20" },
          { name: "Elgato 4K60 Pro MK.2", href: "https://www.amazon.com/dp/B07VWXCXM7?tag=superzydan1-20" },
          { name: "Scuf Custom Gaming Controller", href: "https://www.amazon.com/dp/B0CM728YPY?tag=superzydan1-20" },
          { name: "ULANZI Camera Desk Mount", href: "https://www.amazon.com/dp/B08LV7GZVB?tag=superzydan1-20" },
          { label: "Mouse", name: "Razer DeathAdder V3 Pro Wireless", href: "https://www.amazon.com/dp/B0B6Y52YXB?tag=superzydan1-20" },
          { id: "cloud-alpha", label: "Headphones", name: "HyperX Cloud Alpha", href: "https://www.amazon.com/s?k=HyperX+Cloud+Alpha&tag=superzydan1-20" },
          { name: "WOOZOO Desk Fan", href: "https://www.amazon.com/dp/B094YK23N1?tag=superzydan1-20" },
        ],
      },
    ],
  },
  {
    categories: [
      {
        title: "Monitors",
        products: [
          { label: "Primary", name: "Samsung G7 32 inch", href: "https://www.amazon.com/dp/B0DQQCBGD6?tag=superzydan1-20" },
          { label: "Secondary", name: "Samsung G5 32 Inch", href: "https://www.amazon.com/dp/B08FF3HDW5?tag=superzydan1-20" },
        ],
      },
      {
        title: "Consoles",
        products: [
          { name: "PlayStation 5", href: "https://www.amazon.com/dp/B0CL61F39H?tag=superzydan1-20" },
          { name: "Nintendo Switch", href: "https://www.amazon.com/dp/B0BFJWCYTL?tag=superzydan1-20", note: "and Switch 2" },
        ],
      },
    ],
  },
  {
    photo: setupPhotos.oldKeyboard,
    categories: [
      {
        title: "Previous keyboard",
        blurb: "The board that was on the desk before the Hall Effect upgrade.",
        products: [
          { name: "Glorious GMMK PRO", href: "https://www.amazon.com/s?k=gmmk+pro&tag=superzydan1-20" },
          { name: "Gateron Milky Pro Switches", href: "https://www.amazon.com/dp/B0BBPPP7HD?tag=superzydan1-20" },
          { name: "Polycarbonate Switch Plate" },
          { name: "Custom Keycaps from Goblin Tech Keys", href: "https://goblintechkeys.com/?ref=p8hHC0WDNtCKEx" },
        ],
      },
    ],
  },
];

export const merchPage = {
  title: "Merch",
  blurb:
    "Official SuperZydan merch is still in the works. Until it lands, the Amazon storefront and LTK picks are the closest thing to a shop.",
} as const;

export const contactPage = {
  company: "SuperZydan LLC",
  email: "superzydanofficial@gmail.com",
} as const;

/*
 * Written from what the site actually does (checked 2026-10-21). Not legal
 * advice: the owner should review it, and update it whenever the site starts
 * collecting something new.
 */
export const privacyPage = {
  updated: "October 21, 2026",
  intro:
    "This page explains what happens with your information when you visit superzydanofficial.com, run by SuperZydan LLC. Short version: there are no accounts, no newsletter and nothing for sale here, so I collect very little.",
  sections: [
    {
      title: "Visit stats",
      body: "The site uses Vercel Web Analytics to count page views and see which pages people visit. It doesn't use cookies, and it doesn't build a profile of you. It records things like the page, the referring site, your country and the type of device and browser.",
    },
    {
      title: "Emails you send me",
      body: "The contact forms don't send or store anything on this site. They open your own email app with your message filled in, and it reaches me like any other email at superzydanofficial@gmail.com. I only use what you write to reply to you.",
    },
    {
      title: "Videos, streams and chat",
      body: "YouTube videos, the Twitch player and the Discord chat preview come from those services. They only load when you tap to play or peek, and once they load, YouTube, Twitch and WidgetBot (which runs the Discord preview) may set their own cookies under their own privacy policies.",
    },
    {
      title: "Affiliate and shop links",
      body: "Some links go to Amazon, LTK, HexClad, GameSir, Goblin Tech Keys and HomeRun Pet as affiliate or referral links. If you click one, that store may use cookies to know you came from here, so I can earn a small commission. As an Amazon Associate I earn from qualifying purchases. What you buy is handled by the store, not by this site.",
    },
    {
      title: "Kids",
      body: "The site is family-friendly and my son appears in some content, but the site doesn't ask anyone for personal information. If a child under 13 has emailed me, a parent can reach out and I'll delete the email.",
    },
    {
      title: "Selling or sharing",
      body: "I don't sell or rent anyone's information, and I don't share emails with anyone.",
    },
    {
      title: "Changes",
      body: "If something here changes, this page gets updated along with the date at the top.",
    },
  ],
} as const;
export { affiliateDisclosure };

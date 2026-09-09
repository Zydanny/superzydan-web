export const site = {
  name: "superzydanofficial.com",
  email: "superzydanofficial@gmail.com",
  tagline: "Go Beyond the Surface",
  description:
    "Your hub for chaotic gaming, epic dad-son adventures, tactical streams, tech reviews, and a whole lot of fun.",
} as const;

export const navLinks = [
  { label: "About Us", href: "/about" },
  { label: "LifeStyle", href: "/lifestyle" },
  { label: "VODS", href: "/vods" },
  { label: "Product Reviews", href: "/product-reviews" },
  { label: "SetUp", href: "/setup" },
  { label: "Community", href: "/community" },
  { label: "Merch", href: "/merch" },
  { label: "Contact", href: "/contact" },
] as const;

/*
 * Single source of truth for the Discord invite. lib/discord.ts also reads
 * the code to pull live member counts, so keep it here.
 */
export const discordInviteCode = "xwQFnCErpC";
export const discordInvite = `https://discord.gg/${discordInviteCode}`;

/*
 * WidgetBot live-chat embed (https://e.widgetbot.io/channels/SERVER/CHANNEL).
 * Defaults are Zydan's Digital Domain + #general from the public invite.
 * Override with NEXT_PUBLIC_DISCORD_SERVER_ID / NEXT_PUBLIC_DISCORD_CHANNEL_ID
 * if #general moves. WidgetBot must also be invited: https://add.widgetbot.io/
 */
export const DISCORD_SERVER_ID =
  process.env.NEXT_PUBLIC_DISCORD_SERVER_ID ?? "895086854779600908";
export const DISCORD_CHANNEL_ID =
  process.env.NEXT_PUBLIC_DISCORD_CHANNEL_ID ?? "914637777109401670";

export const socialLinks = [
  { label: "TikTok", href: "https://www.tiktok.com/@SuperZydan" },
  { label: "Amazon Shop", href: "https://www.amazon.com/shop/superzydan" },
  { label: "YouTube", href: "https://www.youtube.com/superzydan" },
  { label: "Instagram", href: "https://www.instagram.com/superzydan/" },
  { label: "Twitch", href: "https://www.twitch.tv/superzydan/" },
  { label: "Discord", href: discordInvite },
  { label: "LTK", href: "https://www.shopltk.com/explore/SuperZydan" },
] as const;

export const heroLinks = [
  { label: "Streaming", href: "#stream" },
  { label: "SetUp", href: "/setup" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Reviews", href: "/product-reviews" },
] as const;

export const twitchUsername = "superzydan";
export const twitchChannel = `https://www.twitch.tv/${twitchUsername}`;

/*
 * Twitch blocks its embed unless the embedding hostname is passed as a `parent`
 * param. Add the production domain(s) via NEXT_PUBLIC_TWITCH_PARENTS as a
 * comma-separated list; localhost is always included for local development.
 */
export const twitchEmbedParents: string[] = Array.from(
  new Set(
    [
      "localhost",
      "superzydanofficial.com",
      "www.superzydanofficial.com",
      ...(process.env.NEXT_PUBLIC_TWITCH_PARENTS ?? "")
        .split(",")
        .map((host) => host.trim()),
    ].filter(Boolean),
  ),
);

/*
 * `value` drives the animated counter. Platforms without a published number
 * render a follow CTA instead so nothing on the page is invented.
 */
export type SocialStat = {
  label: string;
  /** Null when no public figure is available; the card shows a follow CTA instead. */
  value: number | null;
  href: string;
  icon: string;
};

export const socialStats: SocialStat[] = [
  {
    // Overwritten by the live API value; this only shows if that call fails.
    label: "YouTube",
    value: 19500,
    href: "https://www.youtube.com/superzydan",
    icon: "youtube",
  },
  {
    // No public TikTok API exists, so this is maintained by hand.
    label: "TikTok",
    value: 108000,
    href: "https://www.tiktok.com/@SuperZydan",
    icon: "tiktok",
  },
  {
    // Filled from the Twitch API when TWITCH_CLIENT_ID/SECRET are configured.
    label: "Twitch",
    value: null,
    href: twitchChannel,
    icon: "twitch",
  },
  {
    // Filled from the Discord invite endpoint (no API key required).
    label: "Discord",
    value: null,
    href: discordInvite,
    icon: "discord",
  },
  {
    // Maintained by hand, same as TikTok.
    label: "Instagram",
    value: 5421,
    href: "https://www.instagram.com/superzydan",
    icon: "instagram",
  },
];

/*
 * Fallback figures. YouTube is replaced by the live API value when
 * YOUTUBE_API_KEY is configured; TikTok has no public API, so it stays manual.
 */
export const heroStats: { label: string; value: number; format: "compact" | "plain" }[] = [
  { label: "YouTube subs", value: 19500, format: "compact" },
  { label: "TikTok followers", value: 108000, format: "compact" },
];

/*
 * `duration` and `views` are optional: the card renders those pills only when a
 * value is present. Fill them from the YouTube Data API rather than by hand so
 * the numbers stay accurate.
 */
export type VideoMeta = {
  id: string;
  title: string;
  tag: string;
  duration?: string;
  views?: string;
};

/*
 * Fallback list, used only if the YouTube feed is unreachable. All landscape
 * live VODs from the SuperZydan channel, verified via oEmbed author check.
 */
export const youtubeVideos: VideoMeta[] = [
  {
    id: "ZHqjBrN4cFA",
    title:
      "Gateron x Sikakeyb FNP75 HE Unboxing & Sound Test: Stock vs Gateron Magnetic Jade Ultra",
    tag: "Video",
  },
  {
    id: "yr90pUQhJps",
    title: "Our Internet went out, but we're back now!",
    tag: "Live VOD",
  },
  {
    id: "ZZycAYxVdP0",
    title: "Happy Labor day - Lets play some games!",
    tag: "Live VOD",
  },
  {
    id: "1t7ISXn5dN8",
    title: "Chatting and cooking",
    tag: "Live VOD",
  },
];

export const affiliateDisclosure =
  "Purchasing through my affiliate links will help support this channel at no additional cost to you. As an Amazon Associate I earn commission from qualifying purchases. I appreciate you!";

/*
 * Gear showcase. Items flagged `pending` have no confirmed spec sheet yet and
 * render as a "spec TBC" slot rather than showing placeholder numbers as fact.
 */
export type GearItem = {
  title: string;
  subtitle: string;
  blurb: string;
  specs: string[];
  badges: string[];
  href: string;
  cta: string;
  tag: string;
  /** Optional card art — used for the live review boards. */
  image?: string;
  /** True when the spec sheet is not confirmed yet; renders as a "Spec TBC" slot. */
  pending: boolean;
};

export type GearCategory = {
  id: string;
  label: string;
  icon: string;
  items: GearItem[];
};

export const gearCategories: GearCategory[] = [
  {
    id: "keyboards",
    label: "Keyboards",
    icon: "keyboard",
    items: [
      {
        title: "Gateron × SIKAKEYB FNP75 HE",
        subtitle: "Hall Effect 75%",
        blurb:
          "The daily driver. Red, Rapid Trigger, triple spacebar, Magnetic Jade Ultras. I bought it myself — full unboxing and switch test on the blog.",
        specs: [
          "75% Hall Effect",
          "8K polling",
          "Rapid Trigger",
          "Magnetic Jade Ultra",
        ],
        badges: ["Hall Effect", "Rapid Trigger"],
        href: "/lifestyle/gateron-sikakeyb-fnp75-he",
        cta: "Read the review",
        tag: "On the desk",
        image: "/images/gateron-sikakeyb-fnp75-he.jpg",
        pending: false,
      },
    ],
  },
  {
    id: "audio",
    label: "Audio",
    icon: "headphones",
    items: [
      {
        title: "Elgato Wave 3 White",
        subtitle: "Mic chain",
        blurb:
          "Wave 3 on a Wave Mic Arm — white to match the rest of the desk. Same chain from the setup page.",
        specs: ["Elgato Wave 3 White", "Wave Mic Arm"],
        badges: ["Broadcast"],
        href: "/setup#wave-3",
        cta: "See it on the setup",
        tag: "On the desk",
        pending: false,
      },
      {
        title: "HyperX Cloud Alpha",
        subtitle: "Headset",
        blurb: "The monitoring cans on the desk — shop link and the rest of the audio chain live on SetUp.",
        specs: ["HyperX Cloud Alpha"],
        badges: ["Monitoring"],
        href: "/setup#cloud-alpha",
        cta: "See it on the setup",
        tag: "On the desk",
        pending: false,
      },
    ],
  },
  {
    id: "pc",
    label: "PC Specs",
    icon: "cpu",
    items: [
      {
        title: "Custom battlestation",
        subtitle: "Main PC",
        blurb:
          "i9-13900K and a 4090 AERO in a Lian Li O11 Vision. Full parts list, shop links, and more photos on the setup page.",
        specs: [
          "Intel i9-13900K",
          "RTX 4090 AERO",
          "64 GB DDR5 6000",
          "Z790 AORUS PRO",
          "990 PRO 2TB",
          "O11 Vision White",
        ],
        badges: ["Custom build"],
        href: "/setup#gaming-pc",
        cta: "Open the full spec sheet",
        tag: "On the desk",
        image:
          "https://superzydanofficial.com/wp-content/uploads/2025/05/PC-2-1024x768.jpg",
        pending: false,
      },
    ],
  },
  {
    id: "streaming",
    label: "Streaming Gear",
    icon: "video",
    items: [
      {
        title: "Sony Alpha 6000",
        subtitle: "Camera chain",
        blurb:
          "Mirrorless body, Sigma 16mm f/1.4, Cam Link 4K, and a ULANZI desk mount into the stream PC.",
        specs: [
          "Sony a6000",
          "Sigma 16mm f/1.4",
          "Elgato Cam Link 4K",
          "ULANZI desk mount",
        ],
        badges: ["Camera"],
        href: "/setup#sony-a6000",
        cta: "See it on the setup",
        tag: "On the desk",
        image:
          "https://superzydanofficial.com/wp-content/uploads/2025/05/PC-1-1024x768.jpg",
        pending: false,
      },
      {
        title: "Elgato broadcast kit",
        subtitle: "Capture and lights",
        blurb:
          "4K60 Pro MK.2, Stream Deck MK.2, Key Light, and Key Light Air — the rest of the stream desk from SetUp.",
        specs: [
          "4K60 Pro MK.2",
          "Stream Deck MK.2",
          "Key Light",
          "Key Light Air",
        ],
        badges: ["Streaming"],
        href: "/setup#stream-deck",
        cta: "See it on the setup",
        tag: "On the desk",
        pending: false,
      },
    ],
  },
];

/*
 * Placeholder feed for the vlog automation. `thumbnail` reuses YouTube stills
 * so the layout has real imagery without whitelisting another image host.
 */
export type VlogPost = {
  title: string;
  excerpt: string;
  tag: string;
  readTime: number;
  status: string;
  /** Null when the post has no usable image; the card renders a fallback. */
  thumbnail: string | null;
  url: string;
  /** On-site review. Opens in the same tab instead of a new window. */
  internal?: boolean;
};

/*
 * Fallback list, used only if the WordPress REST API is unreachable. Mirrors
 * real published posts so an outage still shows genuine content.
 */
export const vlogPosts: VlogPost[] = [
  {
    title: "Creamy Korean Carbonara Udon: The Ultimate Fusion Comfort Food",
    excerpt:
      "Creamy, savory, and spicy — crispy pancetta, rich Parmesan, and a Korean secret ingredient.",
    tag: "Home & Kitchen",
    readTime: 2,
    status: "Published",
    thumbnail:
      "https://superzydanofficial.com/wp-content/uploads/2025/08/Creamy-Korean-Carbonara-Thubmnail.png",
    url: "https://superzydanofficial.com/creamy-korean-carbonara/",
  },
  {
    title: "Who's the Jedi Master? My Son Challenged Me to a Lightsaber Battle",
    excerpt:
      "My son and I faced off in an epic lightsaber duel filled with hilarious fails, questionable techniques, and a lot of dad jokes.",
    tag: "Lifestyle & Mindset",
    readTime: 1,
    status: "Published",
    // No uploaded image on this post; its embedded video's thumbnail stands in.
    thumbnail: "https://i.ytimg.com/vi/RHOgBjl1V_c/maxresdefault.jpg",
    url: "https://superzydanofficial.com/whos-the-jedi-master/",
  },
  {
    title: "Anker 165W Power Bank: The Ultimate Solution to Your Cord Chaos",
    excerpt:
      "A portable charger with built-in cables that finally ends the cord chaos on the go.",
    tag: "Electronics",
    readTime: 3,
    status: "Published",
    thumbnail:
      "https://superzydanofficial.com/wp-content/uploads/2025/08/Anker-Full-View-1024x766.png",
    url: "https://superzydanofficial.com/anker165-powerbank/",
  },
  {
    title: "Hollyland Lark M2 Review: A Creator's New Best Friend",
    excerpt:
      "A tiny wireless lavalier that punches well above its price for vlogging and streaming.",
    tag: "Electronics",
    readTime: 5,
    status: "Published",
    thumbnail:
      "https://superzydanofficial.com/wp-content/uploads/2025/06/Case-with-open-shot-1024x586.png",
    url: "https://superzydanofficial.com/hollylandlarkm2/",
  },
];

export const partners = [
  { name: "DreamHack Dallas 2025", href: "https://dreamhack.com/dallas/" },
  { name: "HexClad", href: "https://lvnta.com/lv_8oJYlsZ8k8GUl7RcDQ" },
  { name: "GameSir", href: "https://amzn.to/4jLZmTs" },
  { name: "Goblin Tech Keys", href: "https://goblintechkeys.com/?ref=p8hHC0WDNtCKEx" },
] as const;

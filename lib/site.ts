export const site = {
  name: "superzydanofficial.com",
  email: "superzydanofficial@gmail.com",
} as const;

export const navLinks = [
  { label: "About", href: "/about" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "VODs", href: "/vods" },
  { label: "Product Reviews", href: "/product-reviews" },
  { label: "Setup", href: "/setup" },
  { label: "Community", href: "/community" },
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
  { label: "YouTube", href: "https://www.youtube.com/superzydan" },
  { label: "Twitch", href: "https://www.twitch.tv/superzydan/" },
  { label: "Instagram", href: "https://www.instagram.com/superzydan/" },
  { label: "Discord", href: discordInvite },
  { label: "Facebook", href: "https://www.facebook.com/superzydanofficial" },
] as const;

/* Where people can shop my picks. Both are affiliate storefronts. */
export const shopLinks = [
  { label: "Amazon storefront", href: "https://www.amazon.com/shop/superzydan" },
  { label: "LTK", href: "https://www.shopltk.com/explore/SuperZydan" },
] as const;

export const twitchUsername = "superzydan";
export const twitchChannel = `https://www.twitch.tv/${twitchUsername}`;

/*
 * Twitch blocks its embed unless the embedding hostname is passed as a `parent`
 * param. Add the production domain(s) via NEXT_PUBLIC_TWITCH_PARENTS as a
 * comma-separated list. localhost is only added in development builds.
 */
export const twitchEmbedParents: string[] = Array.from(
  new Set(
    [
      ...(process.env.NODE_ENV === "development" ? ["localhost"] : []),
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

/*
 * The home page's video spotlight, right after Watch. Swap this to feature a
 * different video: `title` is only the fallback when the YouTube API is
 * down (the live title, view count and length come from the API), and `post`
 * is the slug of the post the button opens (leave it out for no button).
 */
export const featuredVideo: {
  id: string;
  title: string;
  sign: string;
  blurb: string;
  post?: { slug: string; label: string };
} = {
  id: "VfNLvw444Ws",
  title: "They LIED About IRL Streaming Backpacks! (My $200 Setup BEATS a $3000 Rig)",
  sign: "Start here",
  blurb:
    "Everybody acts like you need a $3,000 backpack to stream IRL. I put one up against the $550 kit I actually carry, then built a starter setup for under $200 with the phone you already have.",
  post: { slug: "budget-irl-streaming-setup", label: "Full gear list" },
};

/*
 * The only Amazon Associates tracking ID the site uses. lib/affiliate.ts puts
 * it on every amazon.com link, replacing any other tag.
 */
export const AMAZON_ASSOCIATE_TAG = "superzydan1-20";

/*
 * The separate product-reviews channel (@superzydanreviews). Its feed fills
 * the Product Reviews page, and scripts/new-review.mjs reads the ID from here.
 */
export const REVIEWS_YOUTUBE_CHANNEL_ID = "UCUvfzwFAAZp2oV-bG0PWk9Q";
export const reviewsChannelUrl = "https://www.youtube.com/@superzydanreviews";

export const affiliateDisclosure =
  "Some links on this site are affiliate or referral links, including Amazon, LTK, Goblin Tech Keys and HomeRun Pet. If you buy through them I may earn a small commission or credit at no extra cost to you. As an Amazon Associate I earn from qualifying purchases. I appreciate you!";

/* Past collabs. `note` is the one line under the name; keep it to what actually happened. */
export const partners = [
  { name: "DreamHack Dallas 2025", note: "In person", href: "https://dreamhack.com/dallas/" },
  {
    name: "HexClad",
    note: "Cookware",
    href: "https://www.amazon.com/stores/page/84D63786-37D7-4ED6-B9B8-496C46020D43?tag=superzydan1-20",
  },
  { name: "GameSir", note: "Controllers", href: "https://www.amazon.com/s?k=GAMESIR&tag=superzydan1-20" },
  { name: "Goblin Tech Keys", note: "Custom keycaps", href: "https://goblintechkeys.com/?ref=p8hHC0WDNtCKEx" },
] as const;

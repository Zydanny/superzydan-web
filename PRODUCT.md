# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **Fans and new viewers (primary).** Most arrive from TikTok on a phone. In about five seconds they need to learn who SuperZydan is, then watch something (the live stream if he's live, the latest video if not) and join the Discord.
2. **Brands (secondary).** Marketing and partnership people sizing up a creator. They need reach by platform, past collabs, audience snapshot, and how to work together. The full pitch lives on the Work With Me page; home gives them a clear way in (header button, collabs strip) without displacing the fan path.

When the two compete for space on the home page, fans win.

## Product Purpose

The official hub for SuperZydan (SuperZydan LLC), "the Zyverse": one place that ties together the Twitch streams, YouTube videos, TikTok, Discord, gear reviews and blog. Success is a new visitor watching something and joining Discord, and a brand finding enough proof and a contact path to reach out.

## Positioning

A real father-son gaming duo: SuperZydan and his son LinkNova playing Roblox, Minecraft and Switch co-op together, unscripted. Around that core: solo night streams (Elden Ring, Bloodborne, Cyberpunk, Valorant), tech and gear reviews (PC builds, Hall Effect keyboards, creator gear), cooking, gym, fashion and comedy skits.

## Operating Context

- Live data the site must keep working: Twitch live status (client polls `/api/twitch/status`), Twitch clips and last stream, YouTube latest videos and subscriber count, Discord member and online counts.
- Blog and review posts are one MDX file each in `content/blog/`, editable from GitHub on a phone. Review posts embed the video and link products through Amazon with the `superzydan1-20` tag.
- Deployed on Vercel from `master`; previews come from the `redesign` branch.

## Capabilities and Constraints

- Next.js 16 App Router, Tailwind v4, shadcn/ui, `motion` (components in `components/motion`), `@vercel/analytics`. Ask before adding anything heavy (e.g. Three.js).
- Mobile first. Lighthouse Performance and Accessibility 90+ on mobile. Embeds (Twitch, YouTube, WidgetBot) lazy-load.
- Motion respects `prefers-reduced-motion`, animates only transform and opacity, no scroll-jacking, no layout shift.
- Merch page exists but is unfinished: kept out of the nav, out of search results and out of the sitemap.
- Amazon Associates rules: product links only from the video description, the storefront or the owner; no Amazon prices, star ratings or product photos; "As an Amazon Associate I earn from qualifying purchases." near Amazon links; links marked `rel="sponsored nofollow"`. One disclosure line also covers the other affiliate and referral links (HexClad, GameSir, Goblin Tech Keys, HomeRun Pet). Never Levanta links.
- Undecided: contact-form service for Work With Me (ask before signing up for anything; mailto fallback), media kit file.

## Brand Commitments

- Name: SuperZydan, "the Zyverse". Keep the existing SZ logo (`public/logo.png`) and favicon (`app/icon.png`).
- Voice: the owner's own. Casual, energetic, family-friendly gamer dad. Unscripted, chaotic fun. First person "I" in general, "we" when it's about him and LinkNova playing together. No AI-stock phrasing ("dive in", "elevate", "unleash", "journey", "seamless", "game-changer"), no filler taglines, no em-dash overuse, no invisible Unicode characters.
- **The son appears only as LinkNova or "my son".** His real first name never appears anywhere: copy, alt text, metadata, file names, commit messages.
- **Photos and video frames of LinkNova may be used anywhere, including the hero, but each one is checked first.** Leave out any frame showing something identifying: school logos or shirts, jerseys with names, street signs, house numbers, his real name anywhere in the frame.
- The old "Go Beyond the Surface" headline is retired; it doesn't say who he is.

## Evidence on Hand

- Platform numbers (keep the live ones live): TikTok about 108K followers (largest platform, hand-maintained), YouTube about 19.5K subscribers (live), Instagram about 5.4K, Twitch about 2.7K (live), Discord about 1.1K members (live).
- TikTok audience: about 87% male, about 65% aged 18 to 34, top countries US, Philippines, Canada, Australia.
- Past collabs: DreamHack Dallas 2025 (in person), HexClad, GameSir, Goblin Tech Keys.
- Storefronts: amazon.com/shop/superzydan, shopltk.com/explore/SuperZydan.
- Socials: YouTube youtube.com/superzydan, TikTok and Instagram @superzydan, Twitch superzydan, Discord https://discord.gg/xwQFnCErpC, Facebook facebook.com/superzydanofficial. X is left out for now.
- Real gear: Intel i9-13900K, NVIDIA RTX 4090, 64 GB DDR5; Sony a6000 with Sigma 16mm f/1.4; Hollyland Lark M2; Gateron x SIKAKEYB FNP75 HE with Magnetic Jade Ultra switches.
- Images: duo photo `public/images/superzydan-linknova.jpg` (checked: nothing identifying), setup photos in `public/images/setup/`, blog and review covers in `public/blog/`.
- Absent, never fabricate: testimonials, brand quotes, campaign results, rates or pricing, partner logos not supplied by the owner, gear not listed above.

## Product Principles

1. Say who he is first: a dad and his son gaming together. Everything else is supporting cast.
2. Get people watching. One tap to the live stream or the latest video, one tap to Discord.
3. Real over polished claims: live numbers, real collabs, real gear, his actual opinions.
4. Phone first, because that's where the TikTok crowd lands.
5. Protect LinkNova: name and images handled by the rules above, every time.

## Accessibility & Inclusion

Good contrast, visible focus states, real alt text, full keyboard navigation, and reduced-motion support everywhere. Family-friendly content.

# superzydanofficial.com

The official site for SuperZydan: father-son gaming with LinkNova, night streams, gear reviews, cooking, and the rest of the Zyverse. Built with Next.js 16, Tailwind CSS 4, shadcn/ui and Motion, and hosted as a Node.js web app on Hostinger.

## Run it locally

You need Node.js 24 (the version in `.nvmrc` and `package.json` `engines`, same as the server).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Before pushing, make sure both of these pass:

```bash
npm run lint
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you have. Every value is optional. Without a key, that feature falls back to a static number or a neutral state, so the site still builds.

- `YOUTUBE_API_KEY`: latest videos on both channels, the Quick Takes grid on Product Reviews, and the live subscriber count. Without it the video lists fall back to YouTube's RSS feeds.
- `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET`: live/offline status, follower count, last stream, and clips.
- `NEXT_PUBLIC_TWITCH_PARENTS`: extra hostnames allowed to embed the Twitch player, such as a temporary hosting domain. It's baked in at build time.
- `SHOW_DRAFTS=true`: shows draft posts in a production build. Only for a temporary review site, never the live one.

The real keys live in `.env.local` on your machine and in the app's Environment variables in Hostinger's hPanel. Never commit `.env.local`.

## Where things live

- `app/`: pages and routes.
- `components/`: UI. `components/ui/` holds the shadcn/ui pieces.
- `lib/`: data and config. `lib/site.ts` has the nav, social links, stats, gear and partners. `lib/twitch.ts`, `lib/youtube.ts` and `lib/discord.ts` pull the live numbers.
- `content/blog/`: blog posts, one `.mdx` file per post, named `<slug>.mdx`. To edit a post, edit its file (this works from the GitHub website on your phone too). Post images go in `public/blog/<slug>/`.
- `public/`: logo, images and other static files.

## Review posts

Reviews are blog posts with `category: Reviews`. They show on the Product Reviews page, filtered by `productCategory`. Extra frontmatter:

- `youtubeId`: the video, shown at the top. Add `short: true` for a vertical Short; that post becomes a Quick Review.
- `disclosure`: how you got the product: `gifted`, `sponsored`, `affiliate`, `purchased`, `own-product` (something you made and sell), or `unclear` until you confirm. `disclosureNote` replaces the standard sentence. It shows at the top of the post.
- `products`: `{ name, url, note }` for each product in the video. Links come only from the video description, your storefront or you.
- `alternatives`: 2 or 3 other options, each with `why`, `tested: true|false` and an optional `othersSay: { text, source, url }` from a real outside review.
- `availabilityNote`: a line shown above the alternatives when the product isn't sold anymore, for example "This one isn't sold on Amazon anymore. Here are similar picks."
- `draft: true`: shows on your computer and on builds made with `SHOW_DRAFTS=true`, never on the live site.

Amazon links always use the tracking ID in `AMAZON_ASSOCIATE_TAG` (`lib/site.ts`). The build fails on Levanta (lvnta.com) links and on Amazon product links that aren't an `amazon.com/dp/<ASIN>` page, except the brand store pages listed in `lib/affiliate.ts`.

- `npm run review:new -- <youtube-url>` drafts a review post from a video.
- `npm run links:audit` checks every Amazon short link on the site and the reviews channel, and maps any that use a different tracking ID to one with ours (`lib/amazon-link-fixes.json`).

## Hosting

The site runs as a Node.js web app on Hostinger at https://superzydanofficial.com, connected to this GitHub repo. `HOSTINGER_SETUP.md` has the hPanel steps. Every push to the connected branch rebuilds and restarts it (`npm run build`, then the Next.js server). Image optimization (sharp), page revalidation, the `/api/twitch/status` route and `proxy.ts` all work there without extra setup.

- `npm run build` uses webpack (`next build --webpack`). Turbopack's production build crashed on Hostinger: it runs PostCSS (Tailwind) in a separate Node process, and Hostinger's build environment ended that process before Turbopack could connect to it. `npm run dev` still uses Turbopack.

- Visit stats come from Cloudflare Web Analytics. The token is `cloudflareAnalyticsToken` in `lib/site.ts`. The beacon only loads on `superzydanofficial.com`, so visits to the temporary domain, previews and localhost never count.
- The canonical address is `https://superzydanofficial.com` (no www), set as `SITE_URL` in `lib/seo.ts`; canonical tags, Open Graph, structured data, the sitemap and robots.txt all follow it. Only that host gets indexed. `proxy.ts` sends `www.superzydanofficial.com` to it with a permanent (308) redirect that keeps the path and query string, and gives every other host (temporary domains, previews) an `X-Robots-Tag: noindex` header without redirecting it.
- The bare domain runs on Hostinger. Hostinger's Node.js app holds only one domain, so `www` points at the Vercel project, which builds `master` too and only answers with that redirect. `GO_LIVE.md` has the current DNS.

## Branches and previews

`master` is the live site, so don't work on it directly.

1. Make a branch: `git checkout -b my-change`
2. Commit your work and push the branch: `git push -u origin my-change`
3. Check it on the temporary site connected to that branch, on your phone and on desktop.
4. When it looks right, merge the branch into `master` and push. That updates the live site.

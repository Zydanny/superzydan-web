# superzydanofficial.com

The official site for SuperZydan: father-son gaming with LinkNova, night streams, gear reviews, cooking, and the rest of the Zyverse. Built with Next.js 16, Tailwind CSS 4, shadcn/ui and Motion, and deployed on Vercel.

## Run it locally

You need Node.js 20 or newer.

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

- `YOUTUBE_API_KEY`: live YouTube subscriber count.
- `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET`: live/offline status, follower count, last stream, and clips.
- `NEXT_PUBLIC_TWITCH_PARENTS`: extra hostnames allowed to embed the Twitch player.

The real keys live in `.env.local` on your machine and in the Vercel project settings. Never commit `.env.local`.

## Where things live

- `app/`: pages and routes.
- `components/`: UI. `components/ui/` holds the shadcn/ui pieces.
- `lib/`: data and config. `lib/site.ts` has the nav, social links, stats, gear and partners. `lib/twitch.ts`, `lib/youtube.ts` and `lib/discord.ts` pull the live numbers.
- `content/blog/`: blog posts, one `.mdx` file per post, named `<slug>.mdx`. To edit a post, edit its file (this works from the GitHub website on your phone too). Post images go in `public/blog/<slug>/`.
- `public/`: logo, images and other static files.

## Branches and previews

`master` is the live site. Vercel deploys every push to `master`, so don't work on it directly.

1. Make a branch: `git checkout -b my-change`
2. Commit your work and push the branch: `git push -u origin my-change`
3. Vercel builds a preview link for the branch. Check it on your phone and on desktop.
4. When it looks right, merge the branch into `master` and push. That updates the live site.

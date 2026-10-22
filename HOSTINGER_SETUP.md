# Hostinger setup: the redesign on a temporary domain

This puts the `redesign` branch on a temporary Hostinger domain so you can check it before going live. It doesn't touch `master`, the live domain, DNS or the old WordPress site.

Menu names come from Hostinger's docs (October 2026). If a label in hPanel is a little different, pick the closest match.

## Before you start

- Leave the existing **superzydanofficial.com** website in hPanel alone. Don't delete it and don't pick that domain in the steps below. That comes later, at go-live.
- Have your keys ready in a password manager or your `.env.local`. You'll paste them straight into hPanel. They never go in GitHub or in this file.

## 1. Create the Node.js web app

1. Log in to hPanel and open **Websites**.
2. Click **Add Website**, then choose **Node.js web app** (it may say **Node.js Apps**).
3. Choose **Import Git repository**.
4. Click **Connect with GitHub**. A GitHub popup asks you to install the **Hostinger** GitHub App.
   - Choose **Only select repositories** and pick **Zydanny/superzydan-web**. That way Hostinger can't see your other repos.
   - Click **Install** (or **Install & Authorize**).
5. Back in hPanel, select **superzydan-web** from the list. If it's missing, use the search box or refresh the list.
6. When it asks for a domain, choose the **temporary domain** that Hostinger offers. It's a free subdomain, usually ending in `.hostingersite.com`. Don't choose superzydanofficial.com.

## 2. Build settings

Hostinger detects Next.js and fills most of these in. Check each one and change what doesn't match:

| Setting | Value |
| --- | --- |
| Framework preset | **Next.js** |
| Branch | **redesign** (it defaults to `master`, so change this one) |
| Node.js version | **24** |
| Root directory | **/** (leave it as the default; `package.json` is at the top of the repo) |
| Package manager | **npm** |
| Build command | **npm run build** (if the field wants a script name only, enter **build**) |
| Output directory | **.next** |
| Entry file | **leave empty** (Hostinger ignores it for Next.js and starts the server itself) |

There's no separate start command for Next.js. Hostinger builds the app in its `standalone` mode and runs that server, which does the same job as `npm start`. The site is already set up for this: blog post files, sharp (image optimization), page refreshes and the `/api/twitch/status` route were all tested in that mode.

## 3. Environment variables

In the same screen, open **Set environment variables** (after setup, it's **Environment variables** in the website dashboard sidebar). Add each one with **Add** and paste the value from your password manager or `.env.local`:

| Name | Value |
| --- | --- |
| `YOUTUBE_API_KEY` | your YouTube Data API key |
| `TWITCH_CLIENT_ID` | your Twitch app's Client ID |
| `TWITCH_CLIENT_SECRET` | your Twitch app's Client Secret |
| `NEXT_PUBLIC_TWITCH_PARENTS` | the temporary domain only, with no `https://` and no slash. Example format: `something.hostingersite.com` |

Notes:

- `superzydanofficial.com` and `www.superzydanofficial.com` are already built in, so `NEXT_PUBLIC_TWITCH_PARENTS` only needs the temporary domain. Add more later with commas, no spaces.
- `NEXT_PUBLIC_TWITCH_PARENTS` is baked in when the site builds. If you only learn the temporary domain after the first deploy, add it then and click **Save**. Saving environment variables redeploys the app, and that new build picks it up. Until then the Twitch player may refuse to load on the temporary domain. Everything else works.
- Don't add `PORT` or `NODE_ENV`. Hostinger sets those itself.
- Optional: `SHOW_DRAFTS` = `true` shows draft posts on the temporary site. You have no drafts right now, so leave it out. If you ever add it, **delete it before the live domain points at this app**, or drafts go public.
- There's an **Import .env** button. Don't use it with `.env.local` unless you've checked that file holds only these keys.

## 4. Deploy

1. Click **Deploy**.
2. Watch the build in **Deployments**, then open the deployment's details for the log. The first build takes a few minutes (installing packages, then `next build`). Installing and building each have a 15-minute limit.
3. If it fails, copy the last 30 or so lines of the log and send them to me.

From now on, every push to `redesign` rebuilds the temporary site on its own (look for the **Auto-deployment** chip on the dashboard). **Redeploy** on the dashboard reruns the last commit.

## 5. Check the temporary site

On your phone and on desktop:

1. Open the temporary domain. Click through Home, About, Lifestyle, a blog post, VODs, Product Reviews, Setup, Community, Work With Me, Contact and Privacy Policy.
2. Check that the live bits fill in: YouTube videos, Twitch status and last stream, Discord counts. If those show fallback numbers, a key is missing or mistyped in **Environment variables**.
3. Tap a Twitch embed (VODs, or Home while you're live) and check that it plays.
4. Check that Google is told to stay away. On a computer, run this with the temporary domain in place of the example:

   ```bash
   curl -I https://something.hostingersite.com/
   ```

   The reply must include `x-robots-tag: noindex, nofollow`. (Or, in Chrome: DevTools, then Network, reload, click the first request, then Response Headers.)

## 6. Cloudflare Web Analytics token

You don't need to move DNS to Cloudflare for this.

1. Make a free Cloudflare account (or log in) and open **Analytics & Logs**, then **Web Analytics**.
2. Click **Add a site**, enter **superzydanofficial.com** and pick the manual (JavaScript snippet) setup.
3. Copy only the token from the snippet: the value after `"token":`.
4. Paste it between the quotes in `cloudflareAnalyticsToken` in `lib/site.ts`, then commit and push to `redesign` (from GitHub on your phone works too). Or send it to me and I'll do it.

Cloudflare only counts visits on the site's own domain, so visits to the temporary domain won't show up. That's expected: stats start once the live domain points at Hostinger.

## Later, at go-live (don't do this yet)

The full checklist, with today's DNS records, the hPanel steps, the checks to run right after and the rollback, is in `GO_LIVE.md`. We'll go through it together when you say so.

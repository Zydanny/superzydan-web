# Go-live: superzydanofficial.com from Vercel to Hostinger

This moves the live domain from the Vercel project to the Hostinger Node.js web app that runs the redesign today on https://ivory-mallard-370119.hostingersite.com. Do it in order, and don't start until the redesign has been checked on the temporary site and you've said it's ready.

## What the DNS looks like today (22 October 2026)

The domain's DNS is already at Hostinger (nameservers `ns1.dns-parking.com` and `ns2.dns-parking.com`), so every change below happens in hPanel. Nothing changes at a registrar.

| Record | Name | Points to | Used by |
| --- | --- | --- | --- |
| A | `@` (superzydanofficial.com) | `216.198.79.1` | Vercel |
| CNAME | `www` | `80fcb165234b9028.vercel-dns-017.com` | Vercel |

There are no MX or TXT records, so no email runs on this domain and nothing mail-related changes. The default TTL is 600 seconds, so a change reaches most people within about 10 minutes.

Write these two Vercel values down. Putting them back is the rollback.

## 1. The day before

- [ ] Make sure the Cloudflare Web Analytics token is in `cloudflareAnalyticsToken` in `lib/site.ts` (it's empty now, so no visit stats load). Optional, but stats only count on the live domain.
- [ ] In hPanel, check the app's **Environment variables**: `YOUTUBE_API_KEY`, `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` and `NEXT_PUBLIC_TWITCH_PARENTS` are there, and `SHOW_DRAFTS` is **not**.
- [ ] In hPanel, check the app's latest deployment is green and its vulnerability scan shows nothing open (Next.js is on 16.4.2 for the October 2026 advisories).
- [ ] Make sure the WordPress backups are still in `Z:\SuperZydan-Website-Redesign\` (the XML export, the SQL dump and the files archive). The XML is the only copy of the old posts.

## 2. Put the redesign on master

- [ ] Tell me to merge `redesign` into `master` and push. (Vercel rebuilds the live site from `master` too. That's fine: the domain still points at Vercel, and the redesign works there.)
- [ ] In hPanel, open the Node.js app, go to its build settings and change **Branch** from `redesign` to `master`. Save, then wait for the deployment in **Deployments** to finish green.
- [ ] Open https://ivory-mallard-370119.hostingersite.com and click through Home, a post and Product Reviews to confirm the `master` build is the one serving.

## 3. Connect the domain in hPanel

- [ ] In hPanel, go to **Websites**. The old WordPress website still holds superzydanofficial.com. hPanel won't attach the domain to the app while it does. If it offers to move the old site to a temporary domain, pick that. If the only choice is to delete it, check the backups are there first, then delete it.
- [ ] Open the Node.js app's dashboard and choose **Connect domain** (it may say **Change domain**). Enter **superzydanofficial.com** and, if it asks separately, **www.superzydanofficial.com**.
- [ ] hPanel then shows the DNS records the app needs. Because the DNS is at Hostinger, it usually offers to update them for you. Let it, or set them by hand in **Domains → superzydanofficial.com → DNS / Nameservers**:
  - Delete the A record `@ → 216.198.79.1` (Vercel).
  - Delete the CNAME `www → 80fcb165234b9028.vercel-dns-017.com` (Vercel).
  - Add exactly the records hPanel's connect screen lists for `@` and `www`. Don't copy the temporary domain's records; use the values that screen gives you.
- [ ] Wait for the SSL certificate. Hostinger issues a free one for both names once the DNS points at it. That can take from a few minutes to about an hour. Don't touch anything while the site shows a certificate warning in that window.

## 4. Right after the switch

Run these from any computer (Git Bash or Terminal). The first two can take up to 10 minutes to change.

```bash
nslookup www.superzydanofficial.com 1.1.1.1
```

- [ ] `www` no longer shows `vercel-dns-017.com` or `216.198.79.1`.

```bash
curl -sI https://www.superzydanofficial.com/
```

- [ ] `HTTP/1.1 200`, and the reply includes `platform: hostinger`.
- [ ] There is **no** `x-robots-tag` line. If there is one, the live domain would drop out of Google: tell me straight away.

```bash
curl -sI "https://superzydanofficial.com/lifestyle/hollylandlarkm2?utm_source=test"
```

- [ ] `HTTP/1.1 308` with `location: https://www.superzydanofficial.com/lifestyle/hollylandlarkm2?utm_source=test`. The app sends this itself (`proxy.ts`), keeping the path and query string. If you get a 200 instead, hPanel isn't passing the bare domain to the app: tell me. If it's a 200 with no `x-robots-tag` line, tell me straight away.

```bash
curl -s https://www.superzydanofficial.com/robots.txt
```

- [ ] It ends with `Sitemap: https://www.superzydanofficial.com/sitemap.xml`. On the temporary domain Hostinger's CDN replaces robots.txt with its own; if the live domain shows `User-agent: Googlebot` / `Disallow: /`, tell me right away, because that blocks Google.

```bash
curl -sI https://www.superzydanofficial.com/hollylandlarkm2/
```

- [ ] A 308 to `/hollylandlarkm2`, which then redirects to `/lifestyle/hollylandlarkm2`. Old blog links still land on their posts.

On your phone and on desktop:

- [ ] The padlock shows on both `superzydanofficial.com` and `www.superzydanofficial.com`, with no certificate warning.
- [ ] Home loads the redesign (not the old Vercel site). Try a private window if your browser cached the old one.
- [ ] The YouTube videos, Twitch status and Discord counts show real numbers, not fallbacks.
- [ ] Tap a Twitch embed on VODs and check that it plays. The live domain is built in, so it needs no setting.
- [ ] Open a review post and tap a product button. It lands on Amazon with `tag=superzydan1-20` in the address.
- [ ] Send yourself a message from the Contact page. It opens your mail app with the message filled in.
- [ ] Share the home page link in a chat app and check the preview card shows the new share image.

## 5. Over the next few days

- [ ] In Google Search Console, open the `superzydanofficial.com` property (add it as a Domain property if it isn't there), submit `https://www.superzydanofficial.com/sitemap.xml`, and use **URL Inspection** on the home page and one post. Both should say indexing is allowed.
- [ ] Watch **Pages** in Search Console for a rise in "Not found (404)". Send me any old URLs that show up and I'll add redirects.
- [ ] Check Cloudflare Web Analytics starts counting visits (only if the token is in).
- [ ] After a week with no problems: in Vercel, remove the domains from the old project, then pause or delete the project. Until then it's the rollback.

## Rollback

If the live site breaks and it can't be fixed quickly, put the two Vercel records back in hPanel's DNS (A `@ → 216.198.79.1`, CNAME `www → 80fcb165234b9028.vercel-dns-017.com`) and remove the records the app added. Within about 10 minutes the domain serves Vercel again, which now builds the redesign from `master`.

# Go-live: superzydanofficial.com from Vercel to Hostinger

This moves the live domain from the Vercel project to the Hostinger Node.js web app that ran the redesign on https://ivory-mallard-370119.hostingersite.com. Steps 1 to 3 are done; what's left is under "Where things stand now".

## Where things stand now (23 October 2026)

**The main address is https://superzydanofficial.com (no www).** Hostinger's Node.js app can hold only one domain, and its SSL never reliably covered `www`. So the bare domain is canonical and served by Hostinger, and `www` only redirects to it:

| Record | Name | Points to | Serves |
| --- | --- | --- | --- |
| ALIAS | `@` (superzydanofficial.com) | `superzydanofficial.com.cdn.hstgr.net` | Hostinger: the site, indexed |
| CNAME | `www` | `80fcb165234b9028.vercel-dns-017.com` | Vercel: a 308 to `https://superzydanofficial.com`, keeping the path and query, with Vercel's certificate |

The app does all of this itself in `proxy.ts`, on whichever host runs it: `www` gets the 308, the bare domain is indexable, and every other host (the temporary Hostinger domain, Vercel previews) gets `X-Robots-Tag: noindex`. Canonical tags, Open Graph, structured data, the sitemap and robots.txt all use `https://superzydanofficial.com`.

While `www` lives on Vercel:

- **Keep the Vercel project, its `www` domain and its link to `master`.** Every push to `master` deploys there too, and that build is what sends the redirect.
- **Hostinger builds `master`** (step 2) and serves the bare domain.
- **The Cloudflare beacon loads only on `superzydanofficial.com`.** Visitors who arrive on `www` are counted after the redirect.

Left to decide later: whether `www` stays a redirect on Vercel or moves to a redirect set up in hPanel (for example a separate website or subdomain redirect on `www`, not the Node.js app). If it moves, check the new `www` certificate first:

```bash
echo | openssl s_client -connect www.superzydanofficial.com.cdn.hstgr.net:443 -servername www.superzydanofficial.com 2>/dev/null | openssl x509 -noout -ext subjectAltName
```

It must print `DNS:www.superzydanofficial.com` before the CNAME changes. On 23 October, Hostinger's servers gave out a `www` certificate on only about 1 in 6 connections.

## DNS before the switch (22 October 2026)

The domain's DNS is already at Hostinger (nameservers `ns1.dns-parking.com` and `ns2.dns-parking.com`), so every change happens in hPanel. Nothing changes at a registrar.

| Record | Name | Points to | Used by |
| --- | --- | --- | --- |
| A | `@` (superzydanofficial.com) | `216.198.79.1` | Vercel |
| CNAME | `www` | `80fcb165234b9028.vercel-dns-017.com` | Vercel |

There are no MX or TXT records, so no email runs on this domain. The default TTL is 600 seconds, so a change reaches most people within about 10 minutes. Putting these two records back is the rollback.

## 1. The day before (done)

- [x] In hPanel, check the app's **Environment variables**: `YOUTUBE_API_KEY`, `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` and `NEXT_PUBLIC_TWITCH_PARENTS` are there, and `SHOW_DRAFTS` is **not**.
- [x] In hPanel, check the app's latest deployment is green and its vulnerability scan shows nothing open (Next.js is on 16.4.2 for the October 2026 advisories).
- [x] Make sure the WordPress backups are still in `Z:\SuperZydan-Website-Redesign\` (the XML export, the SQL dump and the files archive). The XML is the only copy of the old posts.

## 2. Put the redesign on master

- [x] Merge `redesign` into `master` and push.
- [ ] In hPanel, open the Node.js app, go to its build settings and make sure **Branch** is `master`. Save, then wait for the deployment in **Deployments** to finish green.

## 3. Connect the domain in hPanel (done)

- [x] Free superzydanofficial.com from the old WordPress website in hPanel.
- [x] Connect **superzydanofficial.com** to the Node.js app with **Connect domain**.
- [x] DNS: `@` is an ALIAS to `superzydanofficial.com.cdn.hstgr.net`. `www` is a CNAME to Vercel (see the table at the top).
- [x] Hostinger's free SSL certificate covers `superzydanofficial.com`.

## 4. Checks after any DNS or hosting change

Run these from any computer (Git Bash or Terminal). DNS changes can take up to 10 minutes to show.

```bash
curl -sI https://superzydanofficial.com/
```

- [ ] `HTTP/1.1 200`, and the reply includes `platform: hostinger`.
- [ ] There is **no** `x-robots-tag` line. If there is one, the site would drop out of Google: tell me straight away.

```bash
curl -sI "https://www.superzydanofficial.com/lifestyle/hollylandlarkm2?x=1"
```

- [ ] `308` with `location: https://superzydanofficial.com/lifestyle/hollylandlarkm2?x=1`, and no certificate error from curl.

```bash
curl -s https://superzydanofficial.com/robots.txt
```

- [ ] It ends with `Sitemap: https://superzydanofficial.com/sitemap.xml`. If it shows `User-agent: Googlebot` / `Disallow: /` (Hostinger's CDN does that on temporary domains), tell me right away, because that blocks Google.

```bash
curl -s https://superzydanofficial.com/sitemap.xml | grep -c "<loc>https://superzydanofficial.com/"
```

- [ ] The same number as the posts and pages on the site (69 on 23 October), and no `www` addresses in it.

```bash
curl -sI https://superzydanofficial.com/hollylandlarkm2/
```

- [ ] A 308 to `/hollylandlarkm2`, which then redirects to `/lifestyle/hollylandlarkm2`. Old blog links still land on their posts.

On your phone and on desktop:

- [ ] The padlock shows on `superzydanofficial.com`, and typing `www.superzydanofficial.com` lands there with no certificate warning.
- [ ] The YouTube videos, Twitch status and Discord counts show real numbers, not fallbacks.
- [ ] Tap a Twitch embed on VODs and check that it plays. Both names are built in, so it needs no setting.
- [ ] Open a review post and tap a product button. It lands on Amazon with `tag=superzydan1-20` in the address.
- [ ] Send yourself a message from the Contact page. It opens your mail app with the message filled in.
- [ ] Share the home page link in a chat app and check the preview card shows the new share image.
- [ ] On desktop, open DevTools → Network on `superzydanofficial.com` and reload: `beacon.min.js` from `static.cloudflareinsights.com` loads. (It never loads on the temporary domain.)

## 5. Over the next few days

- [ ] In Google Search Console, open the `superzydanofficial.com` Domain property (add it if it isn't there; a Domain property covers both names), submit `https://superzydanofficial.com/sitemap.xml`, and use **URL Inspection** on the home page and one post. Both should say indexing is allowed, with the bare domain as the Google-selected canonical once Google recrawls.
- [ ] Watch **Pages** in Search Console. "Page with redirect" for `www` addresses is expected. Send me any old URLs that show "Not found (404)" and I'll add redirects.
- [ ] Check Cloudflare Web Analytics is counting visits on `superzydanofficial.com`.
- [ ] Keep the Vercel project while it serves the `www` redirect. Only remove it after `www` has a redirect somewhere else.

## Rollback

If the bare domain breaks on Hostinger and it can't be fixed quickly, point `@` back at Vercel with an A record to `216.198.79.1` (and remove the ALIAS). Vercel builds the same `master`, and the app treats the bare domain as canonical wherever it runs. In Vercel's domain settings, make sure the bare domain serves the site rather than redirecting to `www`, or the two redirects would loop.

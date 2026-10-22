@AGENTS.md

# Project rules

## Branches, builds and commits

- `master` is the live site. Work on a branch, push it, and check it on the Hostinger site connected to that branch (phone and desktop) before merging into `master`. Never push to `master` without the owner's OK.
- `npm run lint` and `npm run build` must both pass before every push. The build uses webpack (`next build --webpack`); Turbopack's production build crashes on Hostinger. See "Hosting" in `README.md` and don't switch it back.
- Stage files by name. Never `git add .` or `git add -A`.
- Never commit backups (the WordPress XML, SQL or tar files), `.env.local`, logs or screenshots. Check `git status` before every commit.

## Writing about the family

- The owner's son appears only as **LinkNova** or "my son". Never his real first name: not in copy, alt text, metadata, file names or commit messages.
- Before using any photo or video frame of LinkNova, check it for anything identifying (school logos, names on clothes, street signs, house numbers).

## Affiliate links

- Every Amazon link uses the tracking ID `superzydan1-20` (`AMAZON_ASSOCIATE_TAG` in `lib/site.ts`). Short links that land on another tag get mapped in `lib/amazon-link-fixes.json` (`npm run links:audit`).
- Never use Levanta (lvnta.com) links. The build rejects them.
- Amazon product links are `amazon.com/dp/<ASIN>` pages. Never guess or invent an ASIN or product link; links come only from the video description, the storefront or the owner.
- No Amazon prices, star ratings or product photos anywhere. Use "Check price on Amazon" style buttons and frames from the video or the owner's own photos. Never copy Amazon's text.
- Affiliate links get `rel="sponsored nofollow"`, and the Amazon Associates statement sits near the links.

## Review posts

A review is one `.mdx` file in `content/blog/<slug>.mdx` with `category: Reviews`. `README.md` ("Review posts") documents every field. The essentials:

- Frontmatter: `title`, `seoTitle` (under 60 characters), `seoDescription` (under 155), `reviewedProduct`, `slug`, `date`, `category: Reviews`, `productCategory`, `excerpt`, `cover`, `coverAlt`, `youtubeId` (plus `short: true` for a Short, which makes it a Quick Review), `disclosure`, `draft`, `products` (`{ name, url, store, note }`), and 2 or 3 `alternatives` (`{ name, url, tested, why }`, optional `othersSay: { text, source, url }` from a real outside review, never Amazon customer reviews).
- Alternatives are products sold on amazon.com, linked as `amazon.com/dp/<ASIN>?tag=superzydan1-20`. When the product isn't sold anymore, drop the dead link and add `availabilityNote`.
- Body: the owner's real opinion in his voice, with pros and cons from the video, not a rewrite of the description. Start new posts with `npm run review:new -- <youtube-url>`, which writes a `draft: true` file.
- `disclosure` (wording in `DISCLOSURES` in `lib/blog.ts`):
  - `purchased`: the default, unless the video says the product was sent or sponsored.
  - `gifted`: the brand sent it free.
  - `sponsored`: a paid partnership.
  - `affiliate`: nobody paid or sent it, but the links earn a commission.
  - `own-product`: something the owner made and sells.
  - `unclear`: the video hints it was sent but doesn't say so. Shows nothing on the live site until the owner confirms.
  - `disclosureNote` replaces the standard sentence when needed.
- No ratings for now.

## Design

Follow `DESIGN.md` (and `PRODUCT.md` for who the site is for) for any new design work: its colours, type, chamfered plates, motion rules and reduced-motion behaviour.

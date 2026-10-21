import linkFixes from "@/lib/amazon-link-fixes.json";
import { AMAZON_ASSOCIATE_TAG } from "@/lib/site";

/* Short links that land on another tracking ID, mapped to our tag. Kept up to date by `npm run links:audit`. */
const LINK_FIXES: Record<string, string | null> = linkFixes;

/*
 * Affiliate and referral links get rel="sponsored nofollow" (Google's and
 * Amazon's guidance) and sit under a disclosure. Matches the shorteners and
 * stores the site actually uses.
 */
const AFFILIATE_HOSTS = [
  "amazon.com",
  "amzn.to",
  "geni.us",
  "urlgeni.us",
  "link.amazon",
  "shopltk.com",
  "liketoknow.it",
  // Brand referral links from video descriptions.
  "homerunpet.com",
];

const REFERRAL_PARAMS = ["tag", "ref", "aff", "affiliate"];

export function isAffiliateUrl(href: string): boolean {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    if (AFFILIATE_HOSTS.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
      return true;
    }
    return REFERRAL_PARAMS.some((param) => url.searchParams.has(param));
  } catch {
    return false;
  }
}

export function isAmazonUrl(href: string): boolean {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    return host === "amazon.com" || host.endsWith(".amazon.com") || host === "amzn.to" || host === "link.amazon";
  } catch {
    return false;
  }
}

/*
 * Stamps our tracking ID on amazon.com links, replacing any other tag. Short
 * links (amzn.to, geni.us) carry the tag they were made with, so ones known to
 * use another tag are swapped through LINK_FIXES.
 */
export function withAssociateTag(href: string): string {
  const fixed = LINK_FIXES[href];
  if (fixed) return fixed;
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    if (!(host === "amazon.com" || host.endsWith(".amazon.com")) || url.pathname.startsWith("/shop/")) {
      return href;
    }
    url.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
    return url.toString();
  } catch {
    return href;
  }
}

/* Amazon brand stores the owner approved as a post's main link, for products that aren't sold anymore. */
const APPROVED_AMAZON_STORE_PAGES = ["/stores/GTPLAYER/page/0B4F3664-43B3-4BFE-96C6-86C0E09864A1"];

/*
 * Why a post's product link can't be used, or null when it's fine. Levanta
 * links carry Amazon's tag=maas instead of ours, so they're never allowed.
 * Amazon links must be a product page or an approved store page. Short links
 * pass here; `npm run links:audit` checks where they land.
 */
export function productLinkProblem(href: string): string | null {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "lvnta.com" || host.endsWith(".lvnta.com")) return "Levanta links aren't used; link the Amazon product";
    if (host !== "amazon.com") return null;
    if (isAmazonProductPage(href)) return null;
    if (APPROVED_AMAZON_STORE_PAGES.includes(url.pathname) && url.searchParams.get("tag") === AMAZON_ASSOCIATE_TAG) {
      return null;
    }
    return `Amazon links must be an amazon.com/dp/<ASIN> page with tag=${AMAZON_ASSOCIATE_TAG}`;
  } catch {
    return "not a valid URL";
  }
}

/* An amazon.com/dp/<ASIN> product page carrying our tracking ID. */
export function isAmazonProductPage(href: string): boolean {
  try {
    const url = new URL(href);
    return (
      url.hostname.replace(/^www\./, "") === "amazon.com" &&
      /^\/dp\/[A-Z0-9]{10}\/?$/.test(url.pathname) &&
      url.searchParams.get("tag") === AMAZON_ASSOCIATE_TAG
    );
  } catch {
    return false;
  }
}

/* Required wording from the Amazon Associates Program Operating Agreement. */
export const AMAZON_ASSOCIATE_STATEMENT = "As an Amazon Associate I earn from qualifying purchases.";

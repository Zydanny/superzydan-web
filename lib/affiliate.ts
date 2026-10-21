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
  "lvnta.com",
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

/* Required wording from the Amazon Associates Program Operating Agreement. */
export const AMAZON_ASSOCIATE_STATEMENT = "As an Amazon Associate I earn from qualifying purchases.";

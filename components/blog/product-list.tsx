import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "cn";
import { AMAZON_ASSOCIATE_STATEMENT, isAffiliateUrl, isAmazonUrl } from "@/lib/affiliate";
import type { BlogAlternative, BlogProduct } from "@/lib/blog";

/*
 * Products mentioned in a post, then other options to look at. No prices or
 * Amazon photos on purpose: both go stale, and Amazon only allows them when
 * pulled live from its API. One disclosure above the links covers both lists.
 */
function goesToAmazon(product: BlogProduct) {
  return product.store === "Amazon" || isAmazonUrl(product.url);
}

/* A brand's Amazon store, not one product, so "price" would be misleading. */
function isAmazonStorePage(href: string) {
  return isAmazonUrl(href) && new URL(href).pathname.startsWith("/stores/");
}

/*
 * The shop button, a sign plate like the rest of the site. Only the post's own
 * product gets the magenta fill; everything else is the cyan outline, so a
 * screen never has more than one loud button.
 */
function ProductButton({ product, label, primary }: { product: BlogProduct; label?: string; primary: boolean }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel={isAffiliateUrl(product.url) ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
      className={cn(
        "group/buy relative isolate inline-flex min-h-12 items-center justify-center gap-2 self-start px-5 text-sm font-extrabold tracking-wide uppercase transition-transform duration-150 ease-(--ease-out) select-none active:scale-[0.97] [--cut:9px]",
        primary ? "text-primary-foreground" : "text-neon-cyan",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "chamfer absolute inset-0 -z-10 transition-[filter] duration-200",
          primary ? "bg-neon-magenta group-hover/buy:brightness-110" : "bg-neon-cyan",
        )}
      />
      {primary ? null : (
        <span
          aria-hidden
          className="chamfer absolute inset-[2px] -z-10 bg-night-raised transition-colors duration-200 group-hover/buy:bg-[#0b1a22]"
        />
      )}
      {label ??
        (isAmazonStorePage(product.url)
          ? "Check on Amazon"
          : goesToAmazon(product)
            ? "Check price on Amazon"
            : product.store
              ? `View on ${product.store}`
              : "View product")}
      <ArrowUpRightIcon className="size-4" />
    </a>
  );
}

function Plate({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <li className="chamfer bg-neon-violet/40 p-[2px] [--cut:12px]">
      <div className={cn("chamfer flex h-full flex-col gap-4 bg-night-raised p-5 [--cut:11px]", className)}>{children}</div>
    </li>
  );
}

export function ProductList({
  products,
  alternatives = [],
  availabilityNote,
  title = "Products in this post",
}: {
  products: BlogProduct[];
  alternatives?: BlogAlternative[];
  availabilityNote?: string;
  title?: string;
}) {
  if (products.length === 0 && alternatives.length === 0) return null;

  const all = [...products, ...alternatives];
  const hasAffiliate = all.some((product) => isAffiliateUrl(product.url));
  const hasAmazon = all.some(goesToAmazon);

  return (
    <section aria-labelledby="products-heading" className="mt-16">
      <h2
        id="products-heading"
        data-neon
        className="font-display neon-magenta text-4xl leading-[0.9] font-black text-balance uppercase lg:text-5xl"
      >
        {products.length > 0 ? title : "Other options to look at"}
      </h2>
      {hasAffiliate ? (
        <p className="mt-4 text-sm text-pretty text-haze">
          Some of these are affiliate links. If you buy through them I may earn a small commission at no extra cost to
          you.{hasAmazon ? ` ${AMAZON_ASSOCIATE_STATEMENT}` : ""}
        </p>
      ) : null}

      {products.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {products.map((product, index) => (
            <Plate key={product.url} className="justify-between">
              <div>
                <p className="text-lg font-bold text-white">{product.name}</p>
                {product.note ? <p className="mt-1.5 text-sm text-pretty text-haze">{product.note}</p> : null}
              </div>
              <ProductButton product={product} primary={index === 0} />
            </Plate>
          ))}
        </ul>
      ) : null}

      {alternatives.length > 0 ? (
        <>
          {products.length > 0 ? (
            <h3 className="font-display mt-14 text-3xl leading-none font-black tracking-wide text-white uppercase">
              Other options to look at
            </h3>
          ) : null}
          {availabilityNote ? (
            <p className="mt-4 font-semibold text-pretty text-paint-yellow">{availabilityNote}</p>
          ) : null}
          <ul className="mt-6 grid gap-4">
            {alternatives.map((alternative) => (
              <Plate key={alternative.url}>
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="text-lg font-bold text-white">{alternative.name}</p>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-extrabold tracking-wide uppercase",
                        alternative.tested ? "bg-neon-cyan text-night" : "border border-haze/60 text-haze",
                      )}
                    >
                      {alternative.tested ? "I've tested this" : "Haven't tested it"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-prose text-pretty text-haze">{alternative.why}</p>
                  {alternative.othersSay ? (
                    <p className="mt-2 text-sm text-pretty text-haze">
                      {alternative.othersSay.text}{" "}
                      <a
                        href={alternative.othersSay.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 hover:text-white"
                      >
                        {alternative.othersSay.source}
                      </a>
                    </p>
                  ) : null}
                </div>
                <ProductButton product={alternative} label="Check on Amazon" primary={false} />
              </Plate>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

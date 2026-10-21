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

function ProductButton({ product }: { product: BlogProduct }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel={isAffiliateUrl(product.url) ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
      className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
    >
      {goesToAmazon(product) ? "Check price on Amazon" : product.store ? `View on ${product.store}` : "View product"}
      <ArrowUpRightIcon className="size-4" />
    </a>
  );
}

export function ProductList({
  products,
  alternatives = [],
  title = "Products in this post",
}: {
  products: BlogProduct[];
  alternatives?: BlogAlternative[];
  title?: string;
}) {
  if (products.length === 0 && alternatives.length === 0) return null;

  const all = [...products, ...alternatives];
  const hasAffiliate = all.some((product) => isAffiliateUrl(product.url));
  const hasAmazon = all.some(goesToAmazon);

  return (
    <section aria-labelledby="products-heading" className="mt-14">
      <h2 id="products-heading" className="text-display text-2xl font-bold tracking-tight">
        {products.length > 0 ? title : "Other options to look at"}
      </h2>
      {hasAffiliate ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Some of these are affiliate links. If you buy through them I may earn a small commission at no
          extra cost to you.{hasAmazon ? ` ${AMAZON_ASSOCIATE_STATEMENT}` : ""}
        </p>
      ) : null}

      {products.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <li
              key={product.url}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                {product.note ? <p className="mt-1.5 text-sm text-muted-foreground">{product.note}</p> : null}
              </div>
              <ProductButton product={product} />
            </li>
          ))}
        </ul>
      ) : null}

      {alternatives.length > 0 ? (
        <>
          {products.length > 0 ? (
            <h3 className="text-display mt-12 text-xl font-bold tracking-tight">Other options to look at</h3>
          ) : null}
          <ul className="mt-6 grid gap-4">
            {alternatives.map((alternative) => (
              <li
                key={alternative.url}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{alternative.name}</p>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        alternative.tested ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {alternative.tested ? "I've tested this" : "Haven't tested it"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-zinc-300">{alternative.why}</p>
                  {alternative.othersSay ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {alternative.othersSay.text}{" "}
                      <a
                        href={alternative.othersSay.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                      >
                        {alternative.othersSay.source}
                      </a>
                    </p>
                  ) : null}
                </div>
                <ProductButton product={alternative} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

import { ArrowUpRightIcon } from "lucide-react";
import { AMAZON_ASSOCIATE_STATEMENT, isAffiliateUrl, isAmazonUrl } from "@/lib/affiliate";
import type { BlogProduct } from "@/lib/blog";

/*
 * Products mentioned in a post. No prices or Amazon photos on purpose: both go
 * stale, and Amazon only allows them when pulled live from its API.
 */
function goesToAmazon(product: BlogProduct) {
  return product.store === "Amazon" || isAmazonUrl(product.url);
}

export function ProductList({
  products,
  title = "Products in this post",
}: {
  products: BlogProduct[];
  title?: string;
}) {
  if (products.length === 0) return null;

  const hasAffiliate = products.some((product) => isAffiliateUrl(product.url));
  const hasAmazon = products.some(goesToAmazon);

  return (
    <section aria-labelledby="products-heading" className="mt-14">
      <h2 id="products-heading" className="text-display text-2xl font-bold tracking-tight">
        {title}
      </h2>
      {hasAffiliate ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Some of these are affiliate links. If you buy through them I may earn a small commission at no
          extra cost to you.{hasAmazon ? ` ${AMAZON_ASSOCIATE_STATEMENT}` : ""}
        </p>
      ) : null}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {products.map((product) => {
          const affiliate = isAffiliateUrl(product.url);
          return (
            <li
              key={product.url}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div>
                <p className="font-semibold">{product.name}</p>
                {product.note ? <p className="mt-1.5 text-sm text-muted-foreground">{product.note}</p> : null}
              </div>
              <a
                href={product.url}
                target="_blank"
                rel={affiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"}
                className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {goesToAmazon(product)
                  ? "Check price on Amazon"
                  : product.store
                    ? `View on ${product.store}`
                    : "View product"}
                <ArrowUpRightIcon className="size-4" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

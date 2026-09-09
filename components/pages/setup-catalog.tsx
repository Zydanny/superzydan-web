import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { SpotlightCard } from "@/components/spotlight-card";
import { Reveal } from "@/components/motion/reveal";
import type { SetupCategory, SetupGroup, SetupProduct } from "@/lib/pages";

function ProductRow({ product }: { product: SetupProduct }) {
  const name = (
    <span className="font-medium text-foreground">{product.name}</span>
  );
  const internal = Boolean(product.href?.startsWith("/"));

  const linkedName = product.href ? (
    internal ? (
      <Link
        href={product.href}
        className="group inline-flex items-baseline gap-1 text-sm text-primary hover:underline"
      >
        {name}
        <ArrowUpRightIcon className="size-3.5 shrink-0 translate-y-px opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    ) : (
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group inline-flex items-baseline gap-1 text-sm text-primary hover:underline"
      >
        {name}
        <ArrowUpRightIcon className="size-3.5 shrink-0 translate-y-px opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    )
  ) : (
    <span className="text-sm">{name}</span>
  );

  return (
    <li
      id={product.id}
      className="flex scroll-mt-28 flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-border/60 py-2.5 last:border-b-0"
    >
      {product.label ? (
        <span className="text-eyebrow text-muted-foreground">{product.label}</span>
      ) : null}
      {linkedName}
      {product.note ? (
        <span className="text-sm text-muted-foreground">{product.note}</span>
      ) : null}
    </li>
  );
}

function CategoryCard({ category }: { category: SetupCategory }) {
  return (
    <SpotlightCard className="p-6 md:p-7">
      <h3 id={category.id} className="text-display scroll-mt-28 text-xl">
        {category.title}
      </h3>
      {category.blurb ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {category.blurb}
        </p>
      ) : null}
      <ul className={category.blurb ? "mt-5" : "mt-4"}>
        {category.products.map((product) => (
          <ProductRow key={`${category.title}-${product.name}`} product={product} />
        ))}
      </ul>
    </SpotlightCard>
  );
}

export function SetupCatalog({ groups }: { groups: SetupGroup[] }) {
  return (
    <div className="space-y-10 md:space-y-14">
      {groups.map((group) => (
        <Reveal key={group.categories.map((category) => category.title).join("-")}>
          <div
            className={
              group.photo
                ? "grid w-full items-start gap-6 lg:grid-cols-2 lg:gap-8"
                : group.categories.length > 1
                  ? "grid w-full gap-4 lg:grid-cols-2"
                  : "w-full"
            }
          >
            <div className="space-y-4">
              {group.categories.map((category) => (
                <CategoryCard key={category.title} category={category} />
              ))}
            </div>
            {group.photo ? (
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted lg:sticky lg:top-28 lg:aspect-[4/3]">
                <Image
                  src={group.photo.src}
                  alt={group.photo.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

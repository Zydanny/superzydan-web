import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { cn } from "cn";
import { TubeSign, type Tone } from "@/components/sign-heading";
import type { SetupCategory, SetupGroup, SetupProduct } from "@/lib/pages";

const TONES: Tone[] = ["cyan", "magenta", "violet"];

/* One part: what it is on the left, the part itself on the right, the whole row tappable when it links. */
function ProductRow({ product }: { product: SetupProduct }) {
  const internal = Boolean(product.href?.startsWith("/"));
  const inner = (
    <>
      <span className="text-sm font-bold tracking-wide text-neon-cyan uppercase">{product.label ?? ""}</span>
      <span className="flex min-w-0 items-baseline gap-2">
        <span className={cn("text-pretty", product.href ? "font-semibold text-white" : "text-haze")}>
          {product.name}
          {product.note ? <span className="font-normal text-haze"> {product.note}</span> : null}
        </span>
        {product.href ? (
          internal ? (
            <ArrowRightIcon className="size-4 shrink-0 translate-y-0.5 text-neon-violet transition-colors group-hover/row:text-neon-cyan" />
          ) : (
            <ArrowUpRightIcon className="size-4 shrink-0 translate-y-0.5 text-neon-violet transition-colors group-hover/row:text-neon-cyan" />
          )
        ) : null}
      </span>
    </>
  );
  const rowClass =
    "group/row grid min-h-12 grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)]";

  return (
    <li id={product.id} className="scroll-mt-28 border-b border-neon-violet/20 last:border-b-0">
      {product.href ? (
        internal ? (
          <Link href={product.href} className={rowClass}>
            {inner}
          </Link>
        ) : (
          <a href={product.href} target="_blank" rel="noopener noreferrer sponsored" className={rowClass}>
            {inner}
          </a>
        )
      ) : (
        <div className={rowClass}>{inner}</div>
      )}
    </li>
  );
}

function Category({ category, tone }: { category: SetupCategory; tone: Tone }) {
  return (
    <div id={category.id} className="scroll-mt-28">
      <TubeSign as="h2" tone={tone}>
        {category.title}
      </TubeSign>
      {category.blurb ? <p className="mt-4 max-w-xl text-pretty text-haze">{category.blurb}</p> : null}
      <ul className="mt-4 border-t border-neon-violet/20">
        {category.products.map((product) => (
          <ProductRow key={`${category.title}-${product.name}`} product={product} />
        ))}
      </ul>
    </div>
  );
}

/*
 * The parts list, one station at a time: the lit category sign, the parts, and
 * the photo of that part of the desk beside it (drifting a little as it
 * scrolls, and sticking alongside a long list on desktop).
 */
export function SetupCatalog({ groups }: { groups: SetupGroup[] }) {
  let toneIndex = 0;
  return (
    <div className="grid gap-20 lg:gap-28">
      {groups.map((group, groupIndex) => (
        <div
          key={group.categories.map((category) => category.title).join("-")}
          className={cn(
            "grid items-start gap-8",
            group.photo && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14",
          )}
        >
          <div className="grid gap-12">
            {group.categories.map((category) => (
              <Category key={category.title} category={category} tone={TONES[toneIndex++ % TONES.length]} />
            ))}
          </div>
          {group.photo ? (
            <div
              className={cn(
                "chamfer build-in bg-neon-violet/45 p-[2px] [--cut:16px] lg:sticky lg:top-[calc(var(--header-h)+2rem)]",
                groupIndex % 2 === 1 && "lg:order-first",
              )}
            >
              <div className="chamfer relative aspect-[4/3] overflow-hidden bg-night-raised [--cut:15px]">
                <Image
                  src={group.photo.src}
                  alt={group.photo.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40rem"
                  className="parallax-photo object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

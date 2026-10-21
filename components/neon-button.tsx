import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "cn";

type Variant = "solid" | "outline";

type Props = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & (
  | { href: string; external?: boolean; onClick?: never }
  | { href?: never; external?: never; onClick: () => void }
);

/*
 * The sign-plate button. Solid is the one primary action per screen (magenta);
 * outline is the cyan secondary.
 *
 * The cut-corner plate is an inner layer rather than the element itself:
 * clip-path would also clip the focus ring, and keyboard users need to see it.
 * The outline variant fakes a chamfered border by stacking a night-coloured
 * plate 2px inside a cyan one, since a real border gets cut off at the corners.
 *
 * Press feedback is a quick scale to 0.97 (transform only).
 */
export function NeonButton({
  variant = "solid",
  children,
  className,
  ...rest
}: Props) {
  const classes = cn(
    "group/neon relative isolate inline-flex min-h-12 items-center justify-center gap-2 px-6 text-base font-extrabold tracking-wide uppercase transition-transform duration-150 ease-(--ease-out) select-none active:scale-[0.97] focus-visible:outline-offset-4 [--cut:10px]",
    variant === "solid" ? "text-primary-foreground" : "text-neon-cyan",
    className,
  );

  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          "chamfer absolute inset-0 -z-10 transition-[filter] duration-200",
          variant === "solid"
            ? "bg-neon-magenta group-hover/neon:brightness-110"
            : "bg-neon-cyan",
        )}
      />
      {variant === "outline" ? (
        <span
          aria-hidden
          className="chamfer absolute inset-[2px] -z-10 bg-night transition-colors duration-200 group-hover/neon:bg-[#0b1a22]"
        />
      ) : null}
      {children}
    </>
  );

  if (rest.onClick) {
    return (
      <button type="button" onClick={rest.onClick} className={classes}>
        {content}
      </button>
    );
  }

  if (rest.external) {
    return (
      <a href={rest.href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={rest.href!} className={classes}>
      {content}
    </Link>
  );
}

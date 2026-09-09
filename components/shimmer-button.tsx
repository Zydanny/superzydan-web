import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "cn";

const baseClass =
  "group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-8px_var(--glow-emerald)] transition-shadow duration-300 hover:shadow-[0_0_40px_-4px_var(--glow-emerald)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/* Primary CTA with a light sweep that replays on each hover. */
function Shimmer() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:animate-shimmer"
    />
  );
}

export function ShimmerButton({
  href,
  external = false,
  children,
  className,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const content = (
    <>
      <Shimmer />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClass, className)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(baseClass, className)}>
      {content}
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

/*
 * public/brand/sz-logo.webp is the same graffiti SZ as public/logo.png, cropped
 * to the artwork. The original has so much transparent padding that it read as
 * a smudge at header size.
 */
export function SiteLogo({
  className,
  eager = false,
  wordmark = true,
}: {
  className?: string;
  /** Set on the header logo: it is above the fold, so it must not lazy-load. */
  eager?: boolean;
  wordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group/logo inline-flex items-center gap-2.5", className)}
      aria-label="SuperZydan home"
    >
      <Image
        src="/brand/sz-logo.webp"
        alt=""
        width={560}
        height={619}
        sizes="(min-width: 1024px) 80px, 58px"
        className="h-16 w-auto transition-transform duration-200 ease-(--ease-out) group-active/logo:scale-[0.97] lg:h-20"
        // Eager but not high priority: the big hero logo is the page's LCP image.
        loading={eager ? "eager" : "lazy"}
      />
      {wordmark ? (
        <span className="font-display text-[1.75rem] leading-none font-black tracking-wide uppercase lg:text-4xl">
          SuperZydan
        </span>
      ) : null}
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";

export function SiteLogo({
  className,
  eager = false,
}: {
  className?: string;
  /** Set on the header logo: it is the LCP element, so it must not lazy-load. */
  eager?: boolean;
}) {
  return (
    <Link href="/" className={className} aria-label="superzydanofficial.com home">
      <Image
        src="/logo.png"
        alt="superzydanofficial.com"
        width={72}
        height={82}
        className="h-11 w-auto"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
      />
    </Link>
  );
}

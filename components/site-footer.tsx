import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { affiliateDisclosure, navLinks, shopLinks, site, socialLinks } from "@/lib/site";

/*
 * The end of the street: the logo, where to find me, every page, the shops,
 * the one disclosure line that covers every affiliate and referral link, and
 * the LLC. Every link is a full 44px row so it's easy to hit on a phone.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neon-violet/25 bg-[#0b0816]">
      <div className="shell grid gap-12 py-14 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))] lg:gap-10 lg:py-20">
        <div>
          <SiteLogo />
          <p className="mt-5 max-w-xs text-pretty text-haze">
            Dad and son gaming, night streams, gear reviews and kitchen chaos.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-flex min-h-11 items-center font-semibold break-all text-neon-cyan transition-colors hover:text-white"
          >
            {site.email}
          </a>
        </div>

        <FooterList title="Find me">
          {socialLinks.map((item) => (
            <li key={item.label}>
              <OutLink href={item.href}>{item.label}</OutLink>
            </li>
          ))}
        </FooterList>

        <FooterList title="Pages">
          {navLinks.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex min-h-11 items-center text-haze transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/work-with-me"
              className="flex min-h-11 items-center text-haze transition-colors hover:text-white"
            >
              Work With Me
            </Link>
          </li>
        </FooterList>

        <FooterList title="Shop my picks">
          {shopLinks.map((item) => (
            <li key={item.label}>
              <OutLink href={item.href} sponsored>
                {item.label}
              </OutLink>
            </li>
          ))}
          <li>
            <Link
              href="/privacy-policy"
              className="flex min-h-11 items-center text-haze transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
          </li>
        </FooterList>
      </div>

      <div className="border-t border-neon-violet/20">
        <div className="shell flex flex-col gap-4 py-7 text-sm text-haze lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <p className="max-w-xl text-pretty">{affiliateDisclosure}</p>
          <p className="shrink-0">
            © {new Date().getFullYear()} SuperZydan LLC
            <span aria-hidden className="mx-2 text-neon-violet">
              /
            </span>
            {/* py-3 with -my-3 makes a 44px tap target without changing the row's height. */}
            <Link
              href="/privacy"
              className="-my-3 inline-block py-3 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl leading-none font-black tracking-wide text-white uppercase">{title}</h2>
      <ul className="mt-3 grid">{children}</ul>
    </div>
  );
}

function OutLink({ href, sponsored = false, children }: { href: string; sponsored?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel={sponsored ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      className="group/out flex min-h-11 items-center gap-1.5 text-haze transition-colors hover:text-white"
    >
      {children}
      <ArrowUpRightIcon className="size-3.5 text-neon-violet transition-colors group-hover/out:text-neon-cyan" />
    </a>
  );
}

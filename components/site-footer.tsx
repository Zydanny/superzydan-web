import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SiteLogo } from "@/components/site-logo";
import { navLinks, site, socialLinks } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/20 backdrop-blur-sm">
      <div className="shell grid gap-10 py-16 md:grid-cols-3">
        <div>
          <SiteLogo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Chaotic gaming, cooking, and collabs — buckle up for the Zyverse.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            {site.email}
          </a>
        </div>

        <div>
          <p className="text-eyebrow text-muted-foreground">Navigate</p>
          <ul className="mt-5 grid gap-2.5 text-sm">
            {navLinks.map((item) => (
              <li key={item.label}>
                {"external" in item && item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/privacy-policy"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-eyebrow text-muted-foreground">Social</p>
          <ul className="mt-5 grid gap-2.5 text-sm">
            {socialLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator />
      <p className="shell py-6 text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} {site.name} | Powered by {site.name}
      </p>
    </footer>
  );
}

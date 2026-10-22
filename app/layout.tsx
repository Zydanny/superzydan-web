import type React from "react";
import type { Metadata } from "next";
import { Big_Shoulders, Figtree } from "next/font/google";
import { CloudflareAnalytics } from "@/components/cloudflare-analytics";
import { HashScroll } from "@/components/hash-scroll";
import { NeonSigns } from "@/components/motion/neon-signs";
import { PortalRings } from "@/components/motion/portal-rings";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PAGES, SITE_URL } from "@/lib/seo";
import "./globals.css";

// Condensed signage caps for headlines and the neon signs.
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  // Display type is only ever set black; one static weight keeps the file small.
  weight: "900",
  // Next has no metrics for this face, so name a condensed fallback ourselves.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Roboto Condensed", "sans-serif"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});


/*
 * Defaults only. Every page sets its own whole title, snippet and canonical URL
 * through lib/seo.ts; the template is a safety net for any page that doesn't.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGES.home.title,
    template: "%s | SuperZydan",
  },
  description: PAGES.home.description,
  authors: [{ name: "SuperZydan", url: SITE_URL }],
  creator: "SuperZydan",
  openGraph: {
    title: PAGES.home.title,
    description: PAGES.home.description,
    url: "/",
    siteName: "SuperZydan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGES.home.title,
    description: PAGES.home.description,
  },
  // Hosts other than the live domain also get an X-Robots-Tag: noindex from proxy.ts.
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${bigShoulders.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-night text-foreground">
        <HashScroll />
        <SmoothScroll />
        <NeonSigns />
        <PortalRings />
        <SiteHeader />
        <div className="flex w-full min-w-0 flex-1 flex-col">{children}</div>
        <SiteFooter />
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
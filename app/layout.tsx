import { Analytics } from "@vercel/analytics/react";
import type React from "react";
import type { Metadata } from "next";
import { Big_Shoulders, Figtree } from "next/font/google";
import { HashScroll } from "@/components/hash-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
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


export const metadata: Metadata = {
  metadataBase: new URL("https://superzydanofficial.com"),
  title: {
    default: "SuperZydan | Official Creator Hub",
    template: "%s | SuperZydan",
  },
  description:
    site.description ||
    "Gaming, tactical shooter tech, custom keyboards, PC builds, and creator content.",
  keywords: [
    "SuperZydan",
    "Gaming",
    "Valorant",
    "Hall Effect Keyboards",
    "PC Setup",
    "Twitch Streamer",
    "Tech Reviews",
  ],
  authors: [{ name: "SuperZydan" }],
  creator: "SuperZydan",
  openGraph: {
    title: "SuperZydan | Official Creator Hub",
    description:
      site.description ||
      "Gaming, tactical shooter tech, custom keyboards, PC builds, and creator content.",
    url: "https://superzydanofficial.com",
    siteName: "SuperZydan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperZydan | Official Creator Hub",
    description:
      site.description ||
      "Gaming, tactical shooter tech, custom keyboards, PC builds, and creator content.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <SiteHeader />
        <div className="flex w-full min-w-0 flex-1 flex-col">{children}</div>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
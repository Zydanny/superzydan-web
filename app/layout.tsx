import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AmbientBackground } from "@/components/ambient-background";
import { HashScroll } from "@/components/hash-scroll";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        <AmbientBackground />
        <HashScroll />
        <ScrollProgress />
        <SiteHeader />
        <div className="flex w-full min-w-0 flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
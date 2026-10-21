"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { MenuIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DiscordMark } from "@/components/discord-mark";
import { ShimmerButton } from "@/components/shimmer-button";
import { SiteLogo } from "@/components/site-logo";
import { discordInvite, navLinks } from "@/lib/site";

const linkClass =
  "whitespace-nowrap text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-400 xl:text-base";

export function SiteHeader() {
  const pathname = usePathname();
  /*
   * Remember which page the menu was opened on rather than a plain boolean, so
   * navigating anywhere else closes it without a setState-in-effect.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const menuOpen = openedOn === pathname;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40"
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="mt-4 mb-3 flex items-center justify-between gap-3 rounded-full border border-zinc-800/60 bg-zinc-950/80 px-5 py-2.5 shadow-[0_0_40px_-18px_oklch(0.76_0.18_158_/_0.55)] backdrop-blur-md lg:px-6 lg:py-3 xl:px-8">
          <SiteLogo eager className="shrink-0" />

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-6 2xl:gap-8"
            aria-label="Primary"
          >
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return "external" in item && item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(linkClass, active && "text-emerald-400")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <ShimmerButton
            href={discordInvite}
            external
            className="hidden h-10 shrink-0 rounded-full px-5 lg:inline-flex"
          >
            <DiscordMark className="size-4" />
            Join Discord
          </ShimmerButton>

          <Sheet
            open={menuOpen}
            onOpenChange={(open) => setOpenedOn(open ? pathname : null)}
          >
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-11 shrink-0 rounded-full border-zinc-800 lg:hidden"
                />
              }
            >
              <MenuIcon />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-background/95 backdrop-blur-xl"
            >
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-6" aria-label="Mobile">
                {navLinks.map((item) =>
                  "external" in item && item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center rounded-lg px-3 text-base transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex min-h-11 items-center rounded-lg px-3 text-base transition-colors hover:bg-muted",
                        pathname === item.href && "bg-muted text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <ShimmerButton
                  href={discordInvite}
                  external
                  className="mt-3 min-h-11 justify-center"
                >
                  <DiscordMark className="size-4" />
                  Join Discord
                </ShimmerButton>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

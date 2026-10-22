"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { cn } from "cn";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DiscordMark } from "@/components/discord-mark";
import { NeonButton } from "@/components/neon-button";
import { SiteLogo } from "@/components/site-logo";
import { discordInvite, navLinks } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  /*
   * Remember which page the menu was opened on rather than a plain boolean, so
   * navigating anywhere else closes it without a setState-in-effect.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const menuOpen = openedOn === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-neon-violet/25 bg-night">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-neon-cyan focus:px-3 focus:py-2 focus:font-bold focus:text-night"
      >
        Skip to content
      </a>

      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 lg:gap-6 lg:px-8 lg:py-3 xl:gap-8">
        <SiteLogo eager className="mr-auto shrink-0" />

        <nav className="hidden items-center gap-6 xl:flex 2xl:gap-8" aria-label="Primary">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[0.95rem] font-semibold whitespace-nowrap text-haze transition-colors duration-150 hover:text-white",
                  active &&
                    "text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-neon-cyan",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* The brands' door. Desktop only here; phones get it in the menu. */}
        <NeonButton
          href="/work-with-me"
          variant="violet"
          className="hidden min-h-11 shrink-0 px-4 text-sm whitespace-nowrap [--cut:8px] lg:inline-flex"
        >
          Work with me
        </NeonButton>

        <NeonButton
          href={discordInvite}
          external
          variant="outline"
          className="min-h-11 min-w-11 shrink-0 px-3 text-sm whitespace-nowrap [--cut:8px] sm:px-4"
        >
          <DiscordMark className="size-5 sm:size-4" />
          <span className="sr-only sm:not-sr-only">Join Discord</span>
        </NeonButton>

        <Sheet
          open={menuOpen}
          onOpenChange={(open) => setOpenedOn(open ? pathname : null)}
        >
          <SheetTrigger
            className="grid size-11 shrink-0 place-items-center text-white transition-transform duration-150 active:scale-[0.97] xl:hidden"
          >
            <MenuIcon className="size-6" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="border-neon-violet/30 bg-night">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl font-black tracking-wide uppercase">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4 pb-6" aria-label="Mobile">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center px-3 text-lg font-semibold text-haze transition-colors hover:text-white",
                    pathname === item.href && "bg-night-raised text-white",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/work-with-me"
                aria-current={pathname === "/work-with-me" ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center px-3 text-lg font-semibold text-haze transition-colors hover:text-white",
                  pathname === "/work-with-me" && "bg-night-raised text-white",
                )}
              >
                Work With Me
              </Link>
              <NeonButton href={discordInvite} external className="mt-4">
                <DiscordMark className="size-4" />
                Join the Discord
              </NeonButton>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

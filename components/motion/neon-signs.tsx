"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Gap between signs that reach the screen together, so they light one by one. */
const STAGGER_MS = 160;

/*
 * Neon signs below the fold start switched off and flicker on (opacity only,
 * the tube-on keyframes in globals.css) the first time they reach the screen.
 * Signs already on screen when the page loads stay lit, so nothing above the
 * fold ever blinks out. Mark a sign with data-neon. One observer for the whole
 * page; rescans after each client navigation.
 */
export function NeonSigns() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const signs = Array.from(document.querySelectorAll<HTMLElement>("[data-neon]:not([data-neon='on'])"));
    const viewport = window.innerHeight;
    const below = signs.filter((sign) => sign.getBoundingClientRect().top > viewport);
    for (const sign of below) sign.dataset.neon = "off";

    const observer = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        arriving.forEach((entry, index) => {
          const sign = entry.target as HTMLElement;
          sign.style.setProperty("--neon-delay", `${index * STAGGER_MS}ms`);
          sign.dataset.neon = "on";
          observer.unobserve(sign);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    for (const sign of below) observer.observe(sign);

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

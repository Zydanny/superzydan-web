"use client";

import { useEffect } from "react";

/*
 * Smooth wheel scrolling with Lenis. Touch keeps the phone's own native
 * momentum (Lenis leaves touch alone by default), so this only changes how a
 * mouse wheel or trackpad glides. Loaded after hydration so it never sits on
 * the first paint, and never loaded at all with reduced motion.
 *
 * autoToggle pauses it whenever the page locks scrolling (the menu sheet, the
 * video modal), and allowNestedScroll lets scrollable panels scroll themselves.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: import("lenis").default | null = null;
    let cancelled = false;

    async function start() {
      if (reduce.matches || lenis) return;
      const { default: Lenis } = await import("lenis");
      if (cancelled || reduce.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        autoToggle: true,
        allowNestedScroll: true,
        anchors: { offset: -88 },
        lerp: 0.12,
      });
    }

    function stop() {
      lenis?.destroy();
      lenis = null;
    }

    function onPreferenceChange() {
      if (reduce.matches) stop();
      else void start();
    }

    void start();
    reduce.addEventListener("change", onPreferenceChange);
    return () => {
      cancelled = true;
      reduce.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, []);

  return null;
}

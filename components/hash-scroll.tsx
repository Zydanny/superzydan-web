"use client";

import { useEffect } from "react";

/**
 * Next's client router does not always scroll to `#` targets after a
 * same-origin navigation. Run once on mount and again on hash changes.
 */
export function HashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    scrollToHash();
    const frame = window.requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}

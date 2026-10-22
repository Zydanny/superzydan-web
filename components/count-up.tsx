"use client";

import { useEffect, useRef } from "react";

/*
 * Locale is pinned to en-US on purpose: relying on the runtime default would
 * format differently on the server than in the browser and break hydration.
 */
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const plainFormatter = new Intl.NumberFormat("en-US");

function formatValue(value: number, format: "compact" | "plain") {
  const rounded = Math.round(value);
  return format === "compact" ? compactFormatter.format(rounded) : plainFormatter.format(rounded);
}

/* Fast start, long soft landing: the number races up and eases into place. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

/*
 * Counts up once, the first time the number is on screen. The server renders
 * the final number (so hydration always matches and no-JS shows the real
 * figure); the count writes straight to the text node, no re-renders. No
 * animation with reduced motion.
 */
export function CountUp({
  value,
  format = "compact",
  duration = 1.6,
  className,
}: {
  value: number;
  format?: "compact" | "plain";
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000));
        node.textContent = formatValue(value * easeOutExpo(t), format);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = formatValue(value, format);
    };
  }, [value, format, duration]);

  return (
    <span ref={ref} className={className}>
      {formatValue(value, format)}
    </span>
  );
}

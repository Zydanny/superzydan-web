"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

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
  return format === "compact"
    ? compactFormatter.format(rounded)
    : plainFormatter.format(rounded);
}

/*
 * Counts up once the element scrolls into view. The count lives in a motion
 * value rather than React state, so the animation writes straight to the DOM
 * without re-rendering on every frame. The motion value starts at the final
 * number, which is what the server renders, so hydration always matches.
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
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();

  const count = useMotionValue(value);
  const text = useTransform(count, (latest) => formatValue(latest, format));

  useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    if (!inView) {
      count.set(0);
      return;
    }
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [count, inView, value, duration, reduceMotion]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

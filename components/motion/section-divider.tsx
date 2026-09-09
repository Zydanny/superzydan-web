"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * Hairline that draws itself outward from the centre as a section scrolls in,
 * so the seam between sections reads as a transition instead of dead space.
 */
export function SectionDivider() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-4 top-0 h-px origin-center bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--glow-emerald)_40%,transparent)_35%,color-mix(in_oklch,var(--glow-cyan)_32%,transparent)_65%,transparent)]"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 1, ease: EASE }}
    />
  );
}

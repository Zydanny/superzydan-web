"use client";

import { motion, useScroll, useSpring } from "motion/react";

/* Page-read indicator pinned above the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-[3px] origin-left bg-[linear-gradient(90deg,var(--glow-emerald),var(--glow-cyan))] shadow-[0_0_14px_var(--glow-emerald)]"
    />
  );
}

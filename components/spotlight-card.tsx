"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "cn";

/*
 * Glassmorphic bento surface: cursor-tracked spotlight, a gradient hover ring,
 * and a small lift. Motion values start at 0 so SSR and hydration agree.
 */
export function SpotlightCard({
  children,
  className,
  lift = true,
}: {
  children: ReactNode;
  className?: string;
  lift?: boolean;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = useState(false);

  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--glow-emerald) 14%, transparent), transparent 70%)`;

  return (
    <motion.div
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - bounds.left);
        mouseY.set(event.clientY - bounds.top);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={lift ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={cn(
        "glass relative isolate h-full overflow-hidden rounded-2xl transition-colors duration-300",
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: spotlight }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        aria-hidden
        className="glow-ring pointer-events-none absolute -inset-px -z-10"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />
      {children}
    </motion.div>
  );
}

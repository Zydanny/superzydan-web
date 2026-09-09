"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/*
 * Fixed neon mesh behind the whole page: three emerald/cyan blobs that drift on
 * their own, counter-move with page scroll, and one that trails the cursor.
 * Every motion value starts at a constant so the server and client render
 * identical markup.
 */
export function AmbientBackground() {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.25);

  const springX = useSpring(rawX, { stiffness: 60, damping: 25, mass: 0.6 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 25, mass: 0.6 });

  const left = useTransform(springX, (v) => `${v * 100}%`);
  const top = useTransform(springY, (v) => `${v * 100}%`);

  /*
   * The mesh is position:fixed, so without this it would sit perfectly still
   * while the page moves. Sliding each layer a different amount gives scrolling
   * a sense of depth and shifts which accent dominates further down the page.
   *
   * The scroll offset lives on a wrapper because the blob itself is running the
   * `mesh-drift` keyframes, and a CSS animation on `transform` would win over
   * an inline transform.
   */
  const { scrollYProgress } = useScroll();
  const drift = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 22,
    restDelta: 0.001,
  });
  const emeraldY = useTransform(drift, [0, 1], ["0vh", "36vh"]);
  const cyanY = useTransform(drift, [0, 1], ["0vh", "-28vh"]);
  const deepY = useTransform(drift, [0, 1], ["0vh", "-50vh"]);

  useEffect(() => {
    if (reduceMotion) return;

    let frame = 0;
    function onPointerMove(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        rawX.set(event.clientX / window.innerWidth);
        rawY.set(event.clientY / window.innerHeight);
      });
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [rawX, rawY, reduceMotion]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y: emeraldY }}
      >
        <div className="animate-mesh absolute -top-[30%] -left-[15%] size-[70vw] rounded-full bg-[radial-gradient(circle,var(--glow-emerald),transparent_65%)] opacity-20 blur-[100px]" />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y: cyanY }}
      >
        <div
          className="animate-mesh absolute top-[10%] -right-[20%] size-[60vw] rounded-full bg-[radial-gradient(circle,var(--glow-cyan),transparent_65%)] opacity-[0.14] blur-[110px]"
          style={{ animationDelay: "-5s" }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y: deepY }}
      >
        <div
          className="animate-mesh absolute bottom-[-25%] left-[25%] size-[55vw] rounded-full bg-[radial-gradient(circle,var(--glow-emerald),transparent_70%)] opacity-[0.1] blur-[120px]"
          style={{ animationDelay: "-9s" }}
        />
      </motion.div>

      <motion.div
        className="absolute size-[45vw] rounded-full bg-[radial-gradient(circle,var(--glow-cyan),transparent_60%)] opacity-[0.13] blur-[100px]"
        style={{ left, top, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Vignette keeps text legible over the brightest part of the mesh. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_95%)]" />
    </div>
  );
}

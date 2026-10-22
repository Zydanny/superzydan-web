"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "cn";

/* Desktop with a real mouse, and motion allowed. Phones keep the static sign. */
const QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/* How far the sign leans toward the cursor, in degrees. */
const MAX_TILT_Y = 16;
const MAX_TILT_X = 11;

/* A light spring: quick to follow, settles without wobbling. */
const STIFFNESS = 0.06;
const DAMPING = 0.78;

/*
 * The SZ logo as a neon sign hung in 3D. The server renders the plain logo
 * (it's in the first paint, so it never waits on this). Once the page has
 * loaded and the browser is idle, desktop visitors get the sign upgraded: a
 * glow plate behind it that brightens as they scroll (CSS scroll timeline, see
 * .hero-sign-glow in globals.css) and a tilt toward the mouse on a spring,
 * written straight to the transform with no re-renders.
 */
export function HeroSign({ className, children }: { className?: string; children: ReactNode }) {
  const signRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    if (!media.matches) return;

    let idle = 0;
    const upgrade = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setLit(true), { timeout: 2000 })
        : window.setTimeout(() => setLit(true), 300);
    };
    if (document.readyState === "complete") upgrade();
    else window.addEventListener("load", upgrade, { once: true });

    return () => {
      window.removeEventListener("load", upgrade);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    const sign = signRef.current;
    if (!lit || !sign) return;

    const media = window.matchMedia(QUERY);
    let frame = 0;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };

    function step() {
      for (const axis of ["x", "y"] as const) {
        vel[axis] = (vel[axis] + (target[axis] - pos[axis]) * STIFFNESS) * DAMPING;
        pos[axis] += vel[axis];
      }
      sign!.style.transform = `rotateX(${pos.y.toFixed(2)}deg) rotateY(${pos.x.toFixed(2)}deg)`;
      const settled =
        Math.abs(target.x - pos.x) < 0.01 && Math.abs(target.y - pos.y) < 0.01 && Math.abs(vel.x) + Math.abs(vel.y) < 0.01;
      frame = settled ? 0 : requestAnimationFrame(step);
    }

    function kick() {
      if (!frame) frame = requestAnimationFrame(step);
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !media.matches) return;
      const box = sign!.getBoundingClientRect();
      // -1..1 across the viewport, measured from the sign's centre.
      const dx = (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2);
      const dy = (event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2);
      target.x = Math.max(-1, Math.min(1, dx)) * MAX_TILT_Y;
      target.y = Math.max(-1, Math.min(1, dy)) * -MAX_TILT_X;
      kick();
    }

    function onLeave() {
      target.x = 0;
      target.y = 0;
      kick();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      sign.style.transform = "";
    };
  }, [lit]);

  return (
    <div className={cn("[perspective:900px]", className)}>
      <div ref={signRef} className="relative [transform-style:preserve-3d] will-change-transform">
        {lit ? (
          // The same logo, blurred once into a glow plate set back behind the sign.
          // eslint-disable-next-line @next/next/no-img-element -- decorative copy of an already-loaded image
          <img
            src="/brand/sz-logo.webp"
            alt=""
            aria-hidden
            className="hero-sign-glow pointer-events-none absolute inset-0 size-full object-contain [filter:blur(22px)_saturate(1.6)] [transform:translateZ(-60px)_scale(1.15)]"
          />
        ) : null}
        <div className={lit ? "[transform:translateZ(40px)]" : undefined}>{children}</div>
      </div>
    </div>
  );
}

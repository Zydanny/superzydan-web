import type { CSSProperties, ReactNode } from "react";

/*
 * The Zyverse portal behind every page: big faint neon rings around one point
 * off to the right, each turning its own way as the page scrolls (the motion
 * lives in globals.css). Plain SVG, dim enough that body copy over it keeps
 * its contrast. Phones get the two middle rings only.
 */
function Ring({ turn, opacity, desktopOnly, children }: { turn: string; opacity: number; desktopOnly?: boolean; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="none"
      className={desktopOnly ? "portal-ring max-lg:hidden" : "portal-ring"}
      style={{ "--turn": turn, opacity } as CSSProperties}
    >
      {children}
    </svg>
  );
}

export function PortalRings() {
  return (
    <div aria-hidden className="portal-layer">
      <div className="portal">
        <div className="portal-core" />

        {/* Outer: a ring of fine notches, like a dial. */}
        <Ring turn="65deg" opacity={0.22} desktopOnly>
          <circle cx="500" cy="500" r="492" stroke="var(--neon-violet)" strokeWidth="1.5" />
          <circle cx="500" cy="500" r="472" stroke="var(--neon-violet)" strokeWidth="12" pathLength="360" strokeDasharray="0.5 2.5" />
        </Ring>

        {/* Magenta: long broken arcs with a soft second stroke for the glow. */}
        <Ring turn="-140deg" opacity={0.2}>
          <circle cx="500" cy="500" r="390" stroke="var(--neon-magenta)" strokeWidth="16" strokeOpacity="0.25" pathLength="100" strokeDasharray="34 5 12 5 38 6" strokeLinecap="round" />
          <circle cx="500" cy="500" r="390" stroke="var(--neon-magenta)" strokeWidth="3" pathLength="100" strokeDasharray="34 5 12 5 38 6" strokeLinecap="round" />
        </Ring>

        {/* Cyan: short dashes inside a thin solid line. */}
        <Ring turn="220deg" opacity={0.17}>
          <circle cx="500" cy="500" r="300" stroke="var(--neon-cyan)" strokeWidth="5" pathLength="100" strokeDasharray="7 3" />
          <circle cx="500" cy="500" r="278" stroke="var(--neon-cyan)" strokeWidth="1.25" />
        </Ring>

        {/* Inner: a plain ring with three nodes riding on it. */}
        <Ring turn="-310deg" opacity={0.24} desktopOnly>
          <circle cx="500" cy="500" r="196" stroke="var(--neon-violet)" strokeWidth="1.5" />
          <circle cx="500" cy="304" r="7" fill="var(--neon-magenta)" />
          <circle cx="670" cy="598" r="5" fill="var(--neon-cyan)" />
          <circle cx="330" cy="598" r="5" fill="var(--neon-violet)" />
        </Ring>
      </div>
    </div>
  );
}

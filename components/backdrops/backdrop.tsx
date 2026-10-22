import type { CSSProperties, ReactNode } from "react";
import "./backdrops.css";

/*
 * Three candidate backgrounds for the night ground, previewed on
 * /backdrops/[kind] before one goes site-wide. All three are plain SVG and
 * CSS behind the page, faint enough that body copy keeps its contrast; the
 * motion and the phone trims live in backdrops.css.
 */
export const BACKDROPS = ["portal", "grid", "controllers"] as const;
export type BackdropKind = (typeof BACKDROPS)[number];

export const BACKDROP_LABELS: Record<BackdropKind, string> = {
  portal: "Portal rings",
  grid: "Synthwave grid",
  controllers: "Controller shapes",
};

export function Backdrop({ kind }: { kind: BackdropKind }) {
  return (
    <div aria-hidden className="backdrop">
      {kind === "portal" ? <PortalRings /> : kind === "grid" ? <SynthFloor /> : <ControllerShapes />}
    </div>
  );
}

/* ---------- 1. Portal rings ---------- */

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

function PortalRings() {
  return (
    <div className="portal">
      <div className="portal-core" />

      {/* Outer: a ring of fine notches, like a dial. */}
      <Ring turn="50deg" opacity={0.22} desktopOnly>
        <circle cx="500" cy="500" r="492" stroke="var(--neon-violet)" strokeWidth="1.5" />
        <circle cx="500" cy="500" r="472" stroke="var(--neon-violet)" strokeWidth="12" pathLength="360" strokeDasharray="0.5 2.5" />
      </Ring>

      {/* Magenta: long broken arcs with a soft second stroke for the glow. */}
      <Ring turn="-110deg" opacity={0.2}>
        <circle cx="500" cy="500" r="390" stroke="var(--neon-magenta)" strokeWidth="16" strokeOpacity="0.25" pathLength="100" strokeDasharray="34 5 12 5 38 6" strokeLinecap="round" />
        <circle cx="500" cy="500" r="390" stroke="var(--neon-magenta)" strokeWidth="3" pathLength="100" strokeDasharray="34 5 12 5 38 6" strokeLinecap="round" />
      </Ring>

      {/* Cyan: short dashes inside a thin solid line. */}
      <Ring turn="170deg" opacity={0.17}>
        <circle cx="500" cy="500" r="300" stroke="var(--neon-cyan)" strokeWidth="5" pathLength="100" strokeDasharray="7 3" />
        <circle cx="500" cy="500" r="278" stroke="var(--neon-cyan)" strokeWidth="1.25" />
      </Ring>

      {/* Inner: a plain ring with three nodes riding on it. */}
      <Ring turn="-240deg" opacity={0.24} desktopOnly>
        <circle cx="500" cy="500" r="196" stroke="var(--neon-violet)" strokeWidth="1.5" />
        <circle cx="500" cy="304" r="7" fill="var(--neon-magenta)" />
        <circle cx="670" cy="598" r="5" fill="var(--neon-cyan)" />
        <circle cx="330" cy="598" r="5" fill="var(--neon-violet)" />
      </Ring>
    </div>
  );
}

/* ---------- 2. Synthwave grid floor ---------- */

function SynthFloor() {
  return (
    <>
      <div className="synth-horizon" />
      <div className="synth-floor">
        <div className="synth-plane" />
      </div>
    </>
  );
}

/* ---------- 3. Controller shapes ---------- */

const stroke = { stroke: "currentColor", strokeWidth: 1.75, vectorEffect: "non-scaling-stroke" } as const;

/* Generic pad parts: no console's logo, button symbols or silhouette. */
const SHAPES = {
  pad: (
    <svg viewBox="0 0 120 80" fill="none" strokeLinejoin="round">
      <path {...stroke} d="M30 16h60c14 0 22 12 25 28 3 17-3 28-13 28-8 0-13-8-18-14H36c-5 6-10 14-18 14C8 72 2 61 5 44c3-16 11-28 25-28Z" />
      <path {...stroke} d="M27 32h6v5h5v6h-5v5h-6v-5h-5v-6h5Z" />
      <circle {...stroke} cx="88" cy="32" r="3.2" />
      <circle {...stroke} cx="96" cy="40" r="3.2" />
      <circle {...stroke} cx="80" cy="40" r="3.2" />
      <circle {...stroke} cx="88" cy="48" r="3.2" />
      <circle {...stroke} cx="47" cy="52" r="6" />
      <circle {...stroke} cx="73" cy="52" r="6" />
      <rect {...stroke} x="51" y="29" width="7" height="3" rx="1.5" />
      <rect {...stroke} x="62" y="29" width="7" height="3" rx="1.5" />
    </svg>
  ),
  dpad: (
    <svg viewBox="0 0 100 100" fill="none" strokeLinejoin="round">
      <path {...stroke} d="M37 8h26a4 4 0 0 1 4 4v21h21a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H67v21a4 4 0 0 1-4 4H37a4 4 0 0 1-4-4V67H12a4 4 0 0 1-4-4V37a4 4 0 0 1 4-4h21V12a4 4 0 0 1 4-4Z" />
      <circle {...stroke} cx="50" cy="50" r="7" />
    </svg>
  ),
  buttons: (
    <svg viewBox="0 0 100 100" fill="none">
      <circle {...stroke} cx="50" cy="18" r="12" />
      <circle {...stroke} cx="82" cy="50" r="12" />
      <circle {...stroke} cx="50" cy="82" r="12" />
      <circle {...stroke} cx="18" cy="50" r="12" />
    </svg>
  ),
  stick: (
    <svg viewBox="0 0 100 100" fill="none">
      <circle {...stroke} cx="50" cy="50" r="44" />
      <circle {...stroke} cx="50" cy="50" r="28" />
      <circle {...stroke} cx="50" cy="50" r="20" strokeDasharray="3 5" />
    </svg>
  ),
  arcade: (
    <svg viewBox="0 0 100 120" fill="none" strokeLinejoin="round">
      <circle {...stroke} cx="50" cy="24" r="17" />
      <path {...stroke} d="M50 41v40" />
      <ellipse {...stroke} cx="50" cy="83" rx="14" ry="4" />
      <rect {...stroke} x="14" y="87" width="72" height="24" rx="6" />
    </svg>
  ),
  trigger: (
    <svg viewBox="0 0 120 60" fill="none" strokeLinejoin="round">
      <path {...stroke} d="M12 50C12 26 32 10 60 10s48 16 48 40Z" />
      <path {...stroke} d="M30 50c2-12 14-22 30-22s28 10 30 22" />
    </svg>
  ),
} satisfies Record<string, ReactNode>;

type Piece = {
  shape: keyof typeof SHAPES;
  left: string;
  /* Start and end height in vh: each piece rises from one to the other over the whole page. */
  from: number;
  to: number;
  size: number;
  spin: number;
  tone: "magenta" | "cyan" | "violet";
  desktopOnly?: boolean;
};

/*
 * Spread so a few are always in view: each piece is centred on screen at its
 * own point down the page, and rises from a start to an end height (vh) over
 * the whole scroll, the longer trips moving faster.
 */
const PIECES: Piece[] = [
  { shape: "pad", left: "3%", from: 32, to: -168, size: 220, spin: 35, tone: "violet" },
  { shape: "dpad", left: "86%", from: 55, to: -205, size: 92, spin: -180, tone: "cyan" },
  { shape: "stick", left: "46%", from: 69, to: -111, size: 60, spin: 160, tone: "magenta", desktopOnly: true },
  { shape: "buttons", left: "72%", from: 117, to: -183, size: 110, spin: 140, tone: "magenta" },
  { shape: "arcade", left: "10%", from: 119, to: -101, size: 130, spin: -70, tone: "cyan", desktopOnly: true },
  { shape: "trigger", left: "58%", from: 168, to: -112, size: 120, spin: 90, tone: "violet" },
  { shape: "pad", left: "80%", from: 152, to: -48, size: 240, spin: -30, tone: "magenta", desktopOnly: true },
  { shape: "stick", left: "18%", from: 211, to: -49, size: 84, spin: 300, tone: "cyan" },
  { shape: "dpad", left: "40%", from: 177, to: -3, size: 64, spin: 260, tone: "violet", desktopOnly: true },
  { shape: "buttons", left: "88%", from: 297, to: -3, size: 80, spin: -220, tone: "cyan" },
  { shape: "arcade", left: "64%", from: 270, to: 30, size: 120, spin: 70, tone: "magenta", desktopOnly: true },
  { shape: "pad", left: "6%", from: 252, to: 52, size: 200, spin: 25, tone: "violet" },
];

const TONE = { magenta: "var(--neon-magenta)", cyan: "var(--neon-cyan)", violet: "#9a6bff" };

function ControllerShapes() {
  return (
    <>
      {PIECES.map((piece, index) => (
        <div
          key={index}
          className={piece.desktopOnly ? "pad-shape max-lg:hidden" : "pad-shape"}
          style={
            {
              left: piece.left,
              top: `${piece.from}vh`,
              color: TONE[piece.tone],
              opacity: 0.24,
              "--size": `${piece.size}px`,
              "--dy": `${piece.to - piece.from}vh`,
              "--spin": `${piece.spin}deg`,
            } as CSSProperties
          }
        >
          {SHAPES[piece.shape]}
        </div>
      ))}
    </>
  );
}

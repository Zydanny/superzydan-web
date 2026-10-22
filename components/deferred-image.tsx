"use client";

import { useSyncExternalStore } from "react";
import Image, { type ImageProps } from "next/image";

/* After the page has loaded, how long to wait for the visitor before loading anyway. */
const GRACE_MS = 1500;

let ready = false;
const listeners = new Set<() => void>();

function release() {
  if (ready) return;
  ready = true;
  for (const listener of listeners) listener();
}

/*
 * One shared trigger for every deferred picture: the visitor's first scroll,
 * tap or key press, or a short grace period after the page has loaded,
 * whichever comes first.
 */
function arm() {
  const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
  const onInteract = () => {
    for (const name of events) window.removeEventListener(name, onInteract);
    release();
  };
  for (const name of events) window.addEventListener(name, onInteract, { passive: true, once: true });
  const later = () => window.setTimeout(release, GRACE_MS);
  if (document.readyState === "complete") later();
  else window.addEventListener("load", later, { once: true });
}

function subscribe(listener: () => void) {
  if (listeners.size === 0 && !ready) arm();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/*
 * A next/image for pictures just under the first screen. The browser would
 * otherwise fetch them alongside the hero and slow its first paint, so they
 * wait until the visitor starts moving (or a moment after load). Until then
 * the frame shows its own background in the same space, so nothing shifts.
 */
export function DeferredImage(props: ImageProps) {
  const show = useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is passed through in props
  return show ? <Image {...props} /> : null;
}

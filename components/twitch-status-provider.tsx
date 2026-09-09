"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { TwitchStatus } from "@/lib/twitch";

const POLL_INTERVAL_MS = 60_000;

const TwitchStatusContext = createContext<TwitchStatus | null>(null);

/*
 * One poller for the whole page: the hero badge and the stream section both
 * read from this context, so going live updates every indicator at once
 * without a reload and without duplicate requests.
 *
 * The first value comes from the server render, so there is no loading state
 * and nothing to reconcile during hydration.
 */
export function TwitchStatusProvider({
  initialStatus,
  children,
}: {
  initialStatus: TwitchStatus;
  children: ReactNode;
}) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response = await fetch("/api/twitch/status", { cache: "no-store" });
        if (!response.ok) return;
        const next: TwitchStatus = await response.json();
        if (!cancelled) setStatus(next);
      } catch {
        /* Keep showing the last known status on a network blip. */
      }
    }

    const timer = setInterval(refresh, POLL_INTERVAL_MS);

    // Catch up immediately when someone returns to a backgrounded tab.
    function onVisibilityChange() {
      if (document.visibilityState === "visible") void refresh();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <TwitchStatusContext.Provider value={status}>
      {children}
    </TwitchStatusContext.Provider>
  );
}

export function useTwitchStatus(): TwitchStatus {
  const status = useContext(TwitchStatusContext);
  if (!status) {
    throw new Error("useTwitchStatus must be used inside <TwitchStatusProvider>");
  }
  return status;
}

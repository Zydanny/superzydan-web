"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import type { VideoMeta } from "@/lib/site";

/*
 * The video player dialog: a native <dialog>, so focus is trapped, Escape
 * closes it and the page behind goes inert for free. It fades and rises in
 * with CSS (@starting-style, .video-dialog in globals.css), centred, and
 * closes faster than it opens. The portal is only created after mount, so the
 * server never renders modal markup.
 */
const noop = () => () => {};

export function VideoModal({ video, onClose }: { video: VideoMeta | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (video && !dialog.open) dialog.showModal();
    if (!video && dialog.open) dialog.close();
    if (!video) return;

    // Hold the page still behind the player (this also pauses smooth scrolling).
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [video, hydrated]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Escape and the close button both end up here.
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose, hydrated]);

  // The dialog only exists in the browser; rendering it during hydration would mismatch the server HTML.
  if (!hydrated) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label={video?.title ?? "Video"}
      className="video-dialog m-auto w-[min(100%-2rem,56rem)] bg-transparent p-0 text-foreground"
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="chamfer bg-neon-cyan p-[2px] [--cut:14px]">
        <div className="chamfer bg-night-raised p-2 [--cut:13px]">
          <div className="flex items-center justify-between gap-4 px-2 py-1.5">
            <p className="truncate font-semibold">{video?.title}</p>
            <form method="dialog">
              <button
                type="submit"
                aria-label="Close video"
                className="grid size-11 shrink-0 place-items-center text-haze transition-[color,transform] duration-150 hover:text-white active:scale-[0.97]"
              >
                <XIcon className="size-5" />
              </button>
            </form>
          </div>
          <div className="aspect-video w-full overflow-hidden bg-black">
            {video ? (
              <iframe
                key={video.id}
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full border-0"
              />
            ) : null}
          </div>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, GripIcon } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

const WIDTH = 800;
const HEIGHT = 260;

const versions = [
  {
    id: "clear",
    name: "See-through",
    note: "Sits right on top of your gameplay",
    path: "/overlay/gta6",
  },
  {
    id: "sunset",
    name: "Sunset",
    note: "Brings its own sunset background",
    path: "/overlay/gta6?bg=sunset",
  },
];

/*
 * OBS turns a link dropped onto its window into a Browser Source; these
 * layer-* params name it and size it. The overlay page ignores them.
 */
function obsDropUrl(path: string) {
  const url = new URL(absoluteUrl(path));
  url.searchParams.set("layer-name", "GTA VI countdown");
  url.searchParams.set("layer-width", String(WIDTH));
  url.searchParams.set("layer-height", String(HEIGHT));
  return url.toString();
}

/*
 * "Put it on your stream": the overlay links for other streamers, each with a
 * copy button and an OBS drag link, plus the size and the three steps. Built
 * on <details> so it opens and closes without JavaScript; the copy buttons
 * are the only script.
 */
export function GtaStreamKit() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(
        () => setCopied((current) => (current === id ? null : current)),
        2000,
      );
    } catch {
      // Clipboard blocked: the link is shown in full right above the button, ready to select.
    }
  }

  return (
    <details className="group/kit mt-6 max-w-4xl">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-bold text-white underline decoration-[#2fe0ff] decoration-2 underline-offset-4 hover:text-[#d9fbff] [&::-webkit-details-marker]:hidden">
        Put this countdown on your stream
        <span
          aria-hidden
          className="transition-transform group-open/kit:rotate-90"
        >
          ›
        </span>
      </summary>

      <div className="chamfer mt-3 bg-[#2fe0ff]/70 p-[2px] [--cut:14px]">
        <div className="chamfer bg-[#1a0b33]/90 p-5 backdrop-blur-sm [--cut:13px] lg:p-6">
          <p className="text-white">
            Free for any streamer. In OBS or Streamlabs, add a{" "}
            <strong>Browser Source</strong>, paste one of these links, and set
            it to{" "}
            <strong>
              {WIDTH} × {HEIGHT}
            </strong>
            . Then resize it however you like.
          </p>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {versions.map((version) => {
              const url = absoluteUrl(version.path);
              return (
                <li
                  key={version.id}
                  className="rounded-sm border border-white/15 p-4"
                >
                  <p className="font-bold text-white">{version.name}</p>
                  <p className="text-sm text-[#ffd9ef]">{version.note}</p>
                  <code className="mt-3 block rounded-sm bg-black/40 px-3 py-2 text-sm break-all text-[#d9fbff] select-all">
                    {url}
                  </code>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => copy(version.id, url)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-[#2fe0ff] px-4 font-bold text-[#1a0b33] transition-transform active:scale-[0.97]"
                    >
                      {copied === version.id ? (
                        <CheckIcon className="size-4" />
                      ) : (
                        <CopyIcon className="size-4" />
                      )}
                      {copied === version.id ? "Copied" : "Copy link"}
                    </button>
                    <a
                      href={obsDropUrl(version.path)}
                      draggable
                      onClick={(event) => event.preventDefault()}
                      title="Drag this onto your OBS window"
                      className="hidden min-h-11 cursor-grab items-center md:inline-flex gap-2 rounded-sm border border-white/30 px-4 font-bold text-white active:cursor-grabbing"
                    >
                      <GripIcon className="size-4" />
                      Drag into OBS
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-sm text-[#ffd9ef]">
            It hits zero at 11 PM Central on Nov 18 (midnight Eastern), whatever
            time zone your stream is in.
          </p>
        </div>
      </div>
    </details>
  );
}

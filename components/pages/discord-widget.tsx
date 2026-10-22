"use client";

import { useState } from "react";
import { MessageSquareTextIcon } from "lucide-react";
import { DiscordMark } from "@/components/discord-mark";
import { NeonButton } from "@/components/neon-button";
import { DISCORD_CHANNEL_ID, DISCORD_SERVER_ID, discordInvite } from "@/lib/site";

const widgetSrc =
  DISCORD_SERVER_ID && DISCORD_CHANNEL_ID
    ? `https://e.widgetbot.io/channels/${DISCORD_SERVER_ID}/${DISCORD_CHANNEL_ID}`
    : null;

/*
 * A window into #general. It only loads when someone asks to peek: the embed
 * is heavy, and it's the real, unfiltered chat, so nobody gets it by surprise.
 */
export function DiscordWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="chamfer bg-neon-violet/45 p-[2px] [--cut:16px]">
      <div className="chamfer relative overflow-hidden bg-night-raised [--cut:15px]">
        {open && widgetSrc ? (
          <iframe
            src={widgetSrc}
            title="Live #general chat from the SuperZydan Discord"
            allow="clipboard-write; fullscreen"
            data-lenis-prevent
            className="block h-[min(40rem,75svh)] w-full border-0 bg-[#1a1b1e]"
          />
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 px-6 py-14 text-center">
            <MessageSquareTextIcon aria-hidden className="size-10 text-neon-violet" />
            <p className="max-w-md text-lg text-pretty text-haze">
              {widgetSrc
                ? "Peek at #general right here. It's the live chat, straight from the server, so expect a little chaos."
                : "The chat preview isn't hooked up right now. The server's open though."}
            </p>
            {widgetSrc ? (
              <NeonButton onClick={() => setOpen(true)} variant="outline">
                Peek at the chat
              </NeonButton>
            ) : (
              <NeonButton href={discordInvite} external>
                <DiscordMark className="size-4" />
                Join the Discord
              </NeonButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

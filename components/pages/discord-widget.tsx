import { DISCORD_CHANNEL_ID, DISCORD_SERVER_ID, discordInvite } from "@/lib/site";
import { ShimmerButton } from "@/components/shimmer-button";
import { DiscordMark } from "@/components/discord-mark";

const widgetSrc =
  DISCORD_SERVER_ID && DISCORD_CHANNEL_ID
    ? `https://e.widgetbot.io/channels/${DISCORD_SERVER_ID}/${DISCORD_CHANNEL_ID}`
    : null;

export function DiscordWidget() {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl border border-[#5865F2]/30 bg-[#5865F2]/[0.06] p-2 shadow-[0_0_80px_-28px_#5865F2] md:p-3">
        <div
          aria-hidden
          className="animate-mesh pointer-events-none absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#5865F2,transparent_65%)] opacity-20 blur-3xl"
        />

        {widgetSrc ? (
          <iframe
            src={widgetSrc}
            title="Live Discord chat from Zydan's Digital Domain"
            allow="clipboard-write; fullscreen"
            className="relative z-10 h-[min(40rem,80vh)] w-full rounded-2xl border-0 bg-[#1a1b1e]"
          />
        ) : (
          <div className="relative z-10 flex h-[min(28rem,70vh)] flex-col items-center justify-center gap-4 rounded-2xl bg-background/70 px-6 text-center">
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Set <code className="text-foreground">DISCORD_SERVER_ID</code> and{" "}
              <code className="text-foreground">DISCORD_CHANNEL_ID</code> in{" "}
              <code className="text-foreground">lib/site.ts</code> to preview
              #general here.
            </p>
            <ShimmerButton href={discordInvite} external>
              <DiscordMark className="size-4" />
              Join the Discord
            </ShimmerButton>
          </div>
        )}
      </div>
    </div>
  );
}

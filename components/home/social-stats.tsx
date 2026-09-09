"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { socialStats } from "@/lib/site";

/* What each platform's number actually counts. */
const units: Record<string, string> = {
  YouTube: "subscribers",
  TikTok: "followers",
  Twitch: "followers",
  Discord: "members",
  Instagram: "followers",
};

/*
 * Live figures are passed in from the server: YouTube needs YOUTUBE_API_KEY,
 * Twitch needs the client id/secret pair, Discord needs nothing. Anything
 * still null renders a "Follow" CTA instead of an invented number.
 */
export function SocialStats({
  youtubeSubscribers,
  twitchFollowers,
  discordMembers,
}: {
  youtubeSubscribers: number | null;
  twitchFollowers: number | null;
  discordMembers: number | null;
}) {
  const liveValues: Record<string, number | null> = {
    YouTube: youtubeSubscribers,
    Twitch: twitchFollowers,
    Discord: discordMembers,
  };

  const stats = socialStats.map((stat) => {
    const live = liveValues[stat.label];
    return live != null ? { ...stat, value: live } : stat;
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Network"
        title="Where the community lives"
        description="Counts pull straight from each platform, so they stay current as the channels grow. Tap through to join on any of them."
      />

      <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <a
              href={stat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <SpotlightCard className="group/card flex h-full flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span className="text-eyebrow text-muted-foreground">
                    {stat.label}
                  </span>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground transition-all group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-primary" />
                </div>

                {stat.value === null ? (
                  <p className="mt-8 text-2xl font-medium text-foreground">Follow</p>
                ) : (
                  <div className="mt-8">
                    <p className="text-display text-4xl tabular-nums text-foreground">
                      <CountUp value={stat.value} format="compact" />
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {units[stat.label] ?? "followers"}
                    </p>
                  </div>
                )}
              </SpotlightCard>
            </a>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}

import { discordInviteCode, discordInvite } from "@/lib/site";

export const DISCORD_REVALIDATE_SECONDS = 900;

export type DiscordStats = {
  name: string | null;
  members: number | null;
  online: number | null;
  inviteUrl: string;
};

/*
 * Invite lookups need no API key or bot — `with_counts` returns the same
 * approximate member/online figures Discord shows on its own invite preview.
 * Discord rejects requests without a User-Agent, hence the explicit header.
 */
export async function getDiscordStats(): Promise<DiscordStats> {
  const fallback: DiscordStats = {
    name: null,
    members: null,
    online: null,
    inviteUrl: discordInvite,
  };

  try {
    const response = await fetch(
      `https://discord.com/api/v10/invites/${discordInviteCode}?with_counts=true`,
      {
        headers: { "User-Agent": "superzydanofficial.com (+https://superzydanofficial.com)" },
        next: { revalidate: DISCORD_REVALIDATE_SECONDS },
      },
    );
    if (!response.ok) return fallback;

    const json: {
      guild?: { name?: string };
      approximate_member_count?: number;
      approximate_presence_count?: number;
    } = await response.json();

    return {
      name: json.guild?.name ?? null,
      members: json.approximate_member_count ?? null,
      online: json.approximate_presence_count ?? null,
      inviteUrl: discordInvite,
    };
  } catch {
    return fallback;
  }
}

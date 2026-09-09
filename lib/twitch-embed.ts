import { twitchEmbedParents, twitchUsername } from "@/lib/site";

export function twitchPlayerSrc(autoplay: boolean) {
  const params = new URLSearchParams({
    channel: twitchUsername,
    autoplay: String(autoplay),
    muted: "true",
  });
  for (const parent of twitchEmbedParents) params.append("parent", parent);
  return `https://player.twitch.tv/?${params.toString()}`;
}

export function twitchChatSrc() {
  const params = new URLSearchParams({ darkpopout: "" });
  for (const parent of twitchEmbedParents) params.append("parent", parent);
  return `https://www.twitch.tv/embed/${twitchUsername}/chat?${params.toString()}`;
}

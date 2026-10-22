import { ArrowRightIcon } from "lucide-react";
import { YouTubeEmbed } from "@/components/blog/youtube-embed";
import { NeonButton } from "@/components/neon-button";
import { SignHeading } from "@/components/sign-heading";
import { featuredVideo } from "@/lib/site";

// Fixed locale so the server and the browser print the same "16,956".
const numberFormat = new Intl.NumberFormat("en-US");

/* "PT16M24S" as "16:24" (or "1:02:05" past an hour). */
function videoLength(iso: string | undefined) {
  const match = iso ? /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso) : null;
  if (!match) return null;
  const [, h = "0", m = "0", s = "0"] = match;
  const pad = (value: string) => value.padStart(2, "0");
  return Number(h) > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${Number(m)}:${pad(s)}`;
}

/*
 * One video worth watching first, set in lib/site.ts (featuredVideo): a big
 * screen across the whole rail that only loads YouTube when tapped, a line
 * about it, its views and length, and the post with the full gear list.
 */
export function FeaturedVideo({
  title,
  viewCount,
  duration,
  postHref,
}: {
  title: string;
  viewCount?: number;
  duration?: string;
  postHref: string | null;
}) {
  const length = videoLength(duration);
  const stats = [
    viewCount !== undefined ? { value: numberFormat.format(viewCount), label: "views" } : null,
    length ? { value: length, label: "long" } : null,
  ].filter((stat) => stat !== null);

  return (
    <section aria-labelledby="featured-title" className="render-later border-y border-neon-violet/20">
      <div className="shell shell-y">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <SignHeading id="featured-title" tone="magenta">
            {featuredVideo.sign}
          </SignHeading>
          {stats.length > 0 ? (
            <ul className="flex gap-8">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-baseline gap-2">
                  <span className="font-display neon-cyan text-4xl leading-none font-black tabular-nums lg:text-5xl">
                    {stat.value}
                  </span>
                  <span className="font-semibold text-haze lg:text-lg">{stat.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <YouTubeEmbed id={featuredVideo.id} title={title} large deferred className="mt-8 mb-0 lg:mt-12" />

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <h3 className="max-w-3xl text-2xl font-bold text-balance text-white lg:text-3xl">{title}</h3>
            <p className="mt-3 max-w-2xl text-lg text-pretty text-haze">{featuredVideo.blurb}</p>
          </div>
          {postHref && featuredVideo.post ? (
            <NeonButton href={postHref} className="justify-self-start">
              {featuredVideo.post.label}
              <ArrowRightIcon className="size-4" />
            </NeonButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}

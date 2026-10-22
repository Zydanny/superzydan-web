import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { SignHeading, TubeSign, type Tone } from "@/components/sign-heading";
import { twitchChannel } from "@/lib/site";

type Lane = {
  name: string;
  line: string;
  tone: Tone;
  image: {
    src: string;
    alt: string;
    position?: string;
    /** A cut-out figure stood on a lit stage instead of a full photo. */
    cutout?: boolean;
    /** Video thumbnails carry their own lettering, so they stay put and uncropped. */
    still?: boolean;
  };
  link: { href: string; label: string; external?: boolean };
};

/*
 * Every photo here was checked for anything identifying before it went in
 * (see PRODUCT.md): the duo shot and the lightsaber thumbnail show LinkNova,
 * with no logos, names, signs or house numbers in frame.
 */
const LANES: Lane[] = [
  {
    name: "Co-op with LinkNova",
    line: "Roblox, Minecraft and Switch co-op with my son. Unscripted, loud, and somebody always falls off the map.",
    tone: "magenta",
    image: {
      src: "/images/superzydan-linknova-cutout.webp",
      alt: "SuperZydan and his son LinkNova standing back to back in matching black tees",
      cutout: true,
    },
    link: { href: "/vods", label: "Watch our videos" },
  },
  {
    name: "Night Streams",
    line: "After bedtime it's just me: Elden Ring, Bloodborne, Cyberpunk and Valorant, live on Twitch.",
    tone: "cyan",
    image: { src: "/images/setup/pc-build-2.webp", alt: "The stream PC glowing cyan in the dark", position: "50% 40%" },
    link: { href: twitchChannel, label: "Follow on Twitch", external: true },
  },
  {
    name: "Gear and Tech",
    line: "Hall Effect keyboards, PC parts and creator gear, tested on my own desk before I say a word.",
    tone: "violet",
    image: { src: "/images/setup/desk-setup.webp", alt: "A custom keyboard with a SUPERZYDAN spacebar on a cartoon desk mat" },
    link: { href: "/product-reviews", label: "Read the reviews" },
  },
  {
    name: "Kitchen",
    line: "Smoked tri tip, Korean carbonara udon, and the puff pastry hot dogs we don't talk about.",
    tone: "magenta",
    image: {
      src: "/blog/alfabot-wireless-meat-thermometer/cover.webp",
      alt: "SuperZydan at his smoker with a tri tip on the grill",
      position: "60% 45%",
    },
    link: { href: "/lifestyle", label: "Get the recipes" },
  },
  {
    name: "Gym",
    line: "Sweat and Progress: the workout vlogs, and the gear I actually train with.",
    tone: "cyan",
    image: {
      src: "/blog/sweatandprogress/cover.webp",
      alt: "SuperZydan in the gym on the Sweat and Progress workout vlogs cover",
      still: true,
    },
    link: { href: "/lifestyle/sweatandprogress", label: "Sweat and Progress" },
  },
  {
    name: "Skits",
    line: "Father vs son lightsaber battles and whatever chaos we decide to film next.",
    tone: "violet",
    image: {
      src: "https://i.ytimg.com/vi/RHOgBjl1V_c/maxresdefault.jpg",
      alt: "SuperZydan and LinkNova crossing lightsabers in front of a sunset",
      still: true,
    },
    link: { href: "/lifestyle/whos-the-jedi-master", label: "Who won?" },
  },
];

/*
 * The Zyverse: six content lanes, each a lit sign over a photo. Where the
 * browser has scroll timelines (and motion isn't reduced), the section pins and
 * scrolling slides the row sideways, then lets go (all CSS in globals.css,
 * .lanes). Everywhere else it's a swipeable row.
 */
export function ZyverseLanes() {
  return (
    <section
      id="zyverse"
      aria-labelledby="zyverse-title"
      className="lanes relative"
      style={{ "--lane-count": LANES.length } as CSSProperties}
    >
      <div className="lanes-pin flex flex-col justify-center py-14 lg:py-20">
        <SignHeading
          id="zyverse-title"
          tone="magenta"
          className="shell"
          sub="What you'll catch on the channel, from dad-and-son co-op to the late-night solo runs."
        >
          The Zyverse
        </SignHeading>

        <ul className="lanes-track mt-8 flex gap-5 px-4 lg:mt-12 lg:gap-8 lg:px-8">
          {LANES.map((lane) => (
            <li key={lane.name} className="lane w-[min(80vw,24rem)] shrink-0 snap-start lg:w-[min(30rem,58svh)]">
              <LaneCard lane={lane} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LaneCard({ lane }: { lane: Lane }) {
  const tube = { "--tube": `var(--neon-${lane.tone})` } as CSSProperties;
  const body = (
    <>
      {/* Lit frame around the photo, cut corners like the sign plates. */}
      <div className="chamfer bg-(--tube) p-[2px] [--cut:14px]" style={tube}>
        <div className="chamfer relative aspect-video overflow-hidden bg-night-raised [--cut:13px]">
          {lane.image.cutout ? (
            <>
              {/* The same lit stage the hero stands them on. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_100%,rgb(255_63_180/0.45),rgb(122_60_255/0.25)_45%,transparent_80%)]"
              />
              <Image
                src={lane.image.src}
                alt={lane.image.alt}
                fill
                sizes="(min-width: 1024px) 30rem, 80vw"
                className="lane-photo object-cover object-[50%_12%]"
              />
            </>
          ) : (
            <Image
              src={lane.image.src}
              alt={lane.image.alt}
              fill
              sizes="(min-width: 1024px) 30rem, 80vw"
              className={lane.image.still ? "object-cover" : "lane-photo object-cover"}
              style={{ objectPosition: lane.image.position ?? "50% 50%" }}
            />
          )}
        </div>
      </div>
      <TubeSign as="h3" tone={lane.tone} className="mt-5 text-xl lg:text-2xl">
        {lane.name}
      </TubeSign>
      <p className="mt-3 text-base text-pretty text-haze lg:text-lg">{lane.line}</p>
      <span className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-neon-cyan transition-colors group-hover/lane:text-white">
        {lane.link.label}
        {lane.link.external ? <ArrowUpRightIcon className="size-4" /> : <ArrowRightIcon className="size-4" />}
      </span>
    </>
  );

  const className = "group/lane block focus-visible:outline-offset-8";
  return lane.link.external ? (
    <a href={lane.link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <Link href={lane.link.href} className={className}>
      {body}
    </Link>
  );
}

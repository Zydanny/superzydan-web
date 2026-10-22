import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowDownIcon, MailIcon } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { JsonLd } from "@/components/json-ld";
import { NeonButton } from "@/components/neon-button";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/pages/contact-form";
import { PostCard } from "@/components/post-card";
import { SignHeading, TubeSign } from "@/components/sign-heading";
import { getPost } from "@/lib/blog";
import { getDiscordStats } from "@/lib/discord";
import { breadcrumbJsonLd, PAGES, pageMetadata } from "@/lib/seo";
import { partners, site, socialStats } from "@/lib/site";
import { getTwitchStatus } from "@/lib/twitch";
import { getYouTubeSubscriberCount } from "@/lib/youtube";

export const metadata: Metadata = pageMetadata(PAGES.workWithMe);

export const revalidate = 1800;

/* From TikTok's audience analytics, as supplied by the owner. */
const AUDIENCE = [
  { label: "Male", value: 87 },
  { label: "Aged 18 to 34", value: 65 },
];
const TOP_COUNTRIES = ["United States", "Philippines", "Canada", "Australia"];

const CATEGORIES = [
  "Gaming gear and peripherals",
  "PC and streaming tech",
  "Creator gear",
  "Home and kitchen",
  "Fitness",
  "Apparel",
  "Family-friendly gaming",
];

const SERVICES = [
  {
    name: "Sponsored reviews",
    line: "A full video review on the reviews channel plus a written post here, with the real pros and cons and a clear disclosure.",
  },
  {
    name: "UGC",
    line: "Short-form video made for your own channels and ads, shot in my kitchen, gym or at the desk.",
  },
  {
    name: "Product exchanges",
    line: "Send a product over and I'll use it for real before I say anything about it.",
  },
  {
    name: "Sponsorships",
    line: "A segment or integration in my streams and videos.",
  },
];

/* Real reviews brands can look at for format and tone. */
const EXAMPLES = ["eryntix-adjustable-weight-bench-review", "litter-robot-4-vs-homerunpet-cs106", "gateron-sikakeyb-fnp75-he"];

const FIELDS = [
  { name: "name", label: "Your name", autoComplete: "name", required: true },
  { name: "company", label: "Brand or company", autoComplete: "organization", required: true },
  { name: "email", label: "Work email", type: "email", autoComplete: "email", required: true },
  {
    name: "type",
    label: "What you have in mind",
    type: "select",
    required: true,
    options: ["Sponsored review", "UGC", "Product exchange", "Sponsorship", "Something else"],
  },
  { name: "product", label: "Product or website", required: false, hint: "A link is perfect." },
  { name: "message", label: "Tell me about it", type: "textarea", required: true, hint: "Timing, platforms, anything I should know." },
] as const;

export default async function WorkWithMePage() {
  const [youtube, twitch, discord, ...examplePosts] = await Promise.all([
    getYouTubeSubscriberCount(),
    getTwitchStatus(),
    getDiscordStats(),
    ...EXAMPLES.map((slug) => getPost(slug)),
  ]);
  const fallback = (label: string) => socialStats.find((stat) => stat.label === label)?.value ?? null;

  const reach = [
    { platform: "TikTok", unit: "followers", value: fallback("TikTok"), tone: "magenta" },
    { platform: "YouTube", unit: "subscribers", value: youtube ?? fallback("YouTube"), tone: "cyan" },
    { platform: "Instagram", unit: "followers", value: fallback("Instagram"), tone: "violet" },
    { platform: "Twitch", unit: "followers", value: twitch.followers, tone: "magenta" },
    { platform: "Discord", unit: "members", value: discord.members, tone: "cyan" },
  ].filter((entry): entry is { platform: string; unit: string; value: number; tone: string } => entry.value !== null);

  const examples = examplePosts.filter((post) => post !== null);

  return (
    <main id="content" className="flex-1">
      <PageHero
        title="Work with me"
        tone="violet"
        description="A father-son gaming channel, honest gear reviews and a family-friendly crowd that's mostly on TikTok. Here's who watches and how we can team up."
        aside={
          <section aria-labelledby="reach-title">
            <h2 id="reach-title" className="font-display text-3xl leading-none font-black tracking-wide uppercase">
              Reach
            </h2>
            <p className="mt-2 text-sm text-haze">Live counts where the platforms share them.</p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {reach.map((entry, index) => (
                <li
                  key={entry.platform}
                  className={`chamfer p-[2px] [--cut:12px] ${index === 0 ? "col-span-2" : ""}`}
                  style={{ background: `color-mix(in srgb, var(--neon-${entry.tone}) 55%, transparent)` } as CSSProperties}
                >
                  <p className="chamfer flex h-full flex-col bg-night-raised px-4 py-4 [--cut:11px]">
                    <span
                      className={`font-display leading-none font-black tabular-nums neon-${entry.tone} ${index === 0 ? "text-6xl" : "text-4xl"}`}
                    >
                      <CountUp value={entry.value} />
                    </span>
                    <span className="mt-2 text-sm font-semibold text-haze">
                      <span className="font-bold text-white">{entry.platform}</span> {entry.unit}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <NeonButton href="#contact">
            Start a conversation
            <ArrowDownIcon className="size-4" />
          </NeonButton>
          <NeonButton href={`mailto:${site.email}`} external variant="outline">
            <MailIcon className="size-4" />
            Email me
          </NeonButton>
        </div>
      </PageHero>

      <section aria-labelledby="audience-title" className="border-y border-neon-violet/20">
        <div className="shell shell-y grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SignHeading id="audience-title" tone="cyan" size="md" sub="My TikTok audience, the biggest of the bunch.">
              Who watches
            </SignHeading>
            <ul className="mt-10 grid gap-6">
              {AUDIENCE.map((entry) => (
                <li key={entry.label}>
                  <p className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold text-white">{entry.label}</span>
                    <span className="font-display neon-cyan text-4xl leading-none font-black tabular-nums">
                      {entry.value}%
                    </span>
                  </p>
                  {/* The meter is the figure above drawn to scale; it adds nothing a screen reader needs. */}
                  <div aria-hidden className="mt-3 h-3 bg-night-raised">
                    <div
                      className="h-full origin-left bg-neon-cyan shadow-[0_0_10px_var(--neon-cyan)]"
                      style={{ width: `${entry.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid content-start gap-10">
            <div>
              <h3 className="font-display text-3xl leading-none font-black tracking-wide uppercase">Top countries</h3>
              <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
                {TOP_COUNTRIES.map((country, index) => (
                  <li key={country} className="flex items-baseline gap-3 text-lg text-white">
                    <span className="font-display neon-magenta text-2xl leading-none font-black tabular-nums">
                      {index + 1}
                    </span>
                    {country}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-display text-3xl leading-none font-black tracking-wide uppercase">What I cover</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <li key={category} className="border border-neon-violet/50 px-3 py-2 text-sm font-semibold text-white">
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="services-title" className="shell shell-y">
        <SignHeading id="services-title" tone="violet" size="md" sub="Every partnership gets a clear disclosure, and my real opinion.">
          How we can work together
        </SignHeading>
        <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {SERVICES.map((service, index) => (
            <li key={service.name} className="build-in" style={{ "--i": index } as CSSProperties}>
              <TubeSign as="h3" tone={index % 2 === 0 ? "magenta" : "cyan"} className="text-xl lg:text-2xl">
                {service.name}
              </TubeSign>
              <p className="mt-4 max-w-md text-lg text-pretty text-haze">{service.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="collabs-title" className="border-t border-neon-violet/20">
        <div className="shell shell-y">
          <SignHeading id="collabs-title" tone="cyan" size="md" sub="Brands I've already teamed up with.">
            Past collabs
          </SignHeading>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {partners.map((partner) => (
              <li key={partner.name} className="chamfer bg-neon-violet/45 p-[2px] [--cut:12px]">
                <div className="chamfer flex h-full min-h-28 flex-col justify-between gap-3 bg-night-raised p-4 [--cut:11px] sm:p-5">
                  <p className="font-display text-2xl leading-none font-black tracking-wide uppercase sm:text-3xl">
                    {partner.name}
                  </p>
                  <p className="text-sm font-semibold text-haze">{partner.note}</p>
                </div>
              </li>
            ))}
          </ul>

          {examples.length > 0 ? (
            <>
              <h3 className="font-display mt-16 text-3xl leading-none font-black tracking-wide uppercase">
                How I review things
              </h3>
              <ul className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {examples.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} headingLevel="h3" />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 border-t border-neon-violet/20">
        <div className="shell shell-y grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SignHeading
              id="contact-title"
              tone="magenta"
              size="md"
              sub="Tell me about the product and what you're picturing. I'll get back to you by email."
            >
              Let&apos;s talk
            </SignHeading>
            <p className="mt-6 text-haze">
              Rather write it yourself?{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold break-all text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 hover:text-white"
              >
                {site.email}
              </a>
            </p>
          </div>
          <ContactForm
            fields={FIELDS}
            subject="Collab inquiry from {company}"
            submitLabel="Send the inquiry"
          />
        </div>
      </section>

      <JsonLd
        nodes={[
          breadcrumbJsonLd([
            { name: "Home", path: PAGES.home.path },
            { name: "Work With Me", path: PAGES.workWithMe.path },
          ]),
        ]}
      />
    </main>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SetupCatalog } from "@/components/pages/setup-catalog";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { ShimmerButton } from "@/components/shimmer-button";
import { Reveal } from "@/components/motion/reveal";
import {
  affiliateDisclosure,
  setupGroups,
  setupIntro,
  STOREFRONT_URL,
} from "@/lib/pages";

export const metadata: Metadata = {
  title: "Setup",
  description: setupIntro,
};

export default function SetupPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow="Setup"
        title="The desk that runs the chaos"
        description={setupIntro}
      />

      <Section>
        <SectionHeading
          eyebrow="Loadout"
          title="Gaming PC, keyboard, accessories, monitors, consoles"
          description="Every shop link is an affiliate link. Same price for you, a little support for the channel."
        />
        <SetupCatalog groups={setupGroups} />
      </Section>

      <Section>
        <Reveal>
          <div className="glass flex flex-col gap-5 rounded-2xl p-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {affiliateDisclosure}
            </p>
            <ShimmerButton href={STOREFRONT_URL} external>
              Amazon storefront
            </ShimmerButton>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}

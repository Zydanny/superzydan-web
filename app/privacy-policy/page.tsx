import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SpotlightCard } from "@/components/spotlight-card";
import { privacyPage } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: privacyPage.intro,
};

export default function PrivacyPolicyPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow={privacyPage.eyebrow}
        title={privacyPage.title}
        description={`Last updated ${privacyPage.updated}.`}
      />
      <Section>
        <SpotlightCard className="space-y-8 p-8 md:p-10">
          <p className="leading-relaxed text-muted-foreground">{privacyPage.intro}</p>
          {privacyPage.sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-display text-xl">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
          <p className="text-sm text-muted-foreground">
            Questions? Reach out on the contact page. This policy aligns with general
            Texas and U.S. privacy standards but is not legal advice.
          </p>
        </SpotlightCard>
      </Section>
    </main>
  );
}

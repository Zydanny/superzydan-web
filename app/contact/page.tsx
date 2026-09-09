import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/pages/contact-form";
import { Section } from "@/components/section";
import { SpotlightCard } from "@/components/spotlight-card";
import { contactPage } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Contact",
  description: contactPage.blurb,
};

export default function ContactPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        description={contactPage.blurb}
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <ContactForm />
          <SpotlightCard className="p-8">
            <p className="text-eyebrow text-primary">Company</p>
            <h2 className="text-display mt-3 text-2xl">{contactPage.company}</h2>
            <a
              href={`mailto:${contactPage.email}`}
              className="mt-4 inline-block text-primary hover:underline"
            >
              {contactPage.email}
            </a>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              The form opens a draft in your email app so the message lands in the
              same inbox — no third-party form service in the middle.
            </p>
          </SpotlightCard>
        </div>
      </Section>
    </main>
  );
}

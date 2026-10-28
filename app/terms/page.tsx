import type { Metadata } from "next";
import { Section, TextLink } from "@/components/legal-prose";
import { PageHero } from "@/components/page-hero";
import { absoluteUrl, PAGES, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGES.appTerms);

/*
 * Terms of Service for ZydanEditor, the owner's private upload tool. Google's
 * YouTube API audit links to this URL, so keep the path. Its privacy policy is
 * at /privacy.
 */

/* A legal page reads as plain prose: one column, no cards, no motion. */
export default function AppTermsPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero title="Terms of Service" tone="violet" description="Last updated: October 27, 2026" />

      <article className="shell shell-y">
        <div className="max-w-2xl">
          <p className="text-xl leading-relaxed text-pretty text-white">
            These terms cover ZydanEditor, a private internal tool run by SuperZydan LLC (&ldquo;I&rdquo;,
            &ldquo;me&rdquo;).
          </p>

          <Section title="What it is">
            <p>
              ZydanEditor is a private internal tool. I use it only to upload my own videos to my own YouTube channel.
              It is not a public app or service, and it is not offered, sold or licensed to anyone else.
            </p>
          </Section>

          <Section title="Who can use it">
            <p>Only me, SuperZydan LLC. There are no other users and no sign-ups.</p>
          </Section>

          <Section title="YouTube API Services">
            <p>
              ZydanEditor uses YouTube API Services. By using it, I agree to be bound by the YouTube Terms of Service (
              <TextLink href="https://www.youtube.com/t/terms" />) and the Google Privacy Policy (
              <TextLink href="https://policies.google.com/privacy" />
              ).
            </p>
          </Section>

          <Section title="Data">
            <p>
              No data is sold or shared. What the tool accesses and stores, and how to remove its access, is explained
              in the ZydanEditor Privacy Policy:{" "}
              <TextLink href={PAGES.appPrivacy.path}>{absoluteUrl(PAGES.appPrivacy.path)}</TextLink>
            </p>
          </Section>

          <Section title="Changes">
            <p>If these terms change, this page gets updated along with the date at the top.</p>
          </Section>

          <Section title="Contact">
            <p>
              <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
            </p>
          </Section>
        </div>
      </article>
    </main>
  );
}

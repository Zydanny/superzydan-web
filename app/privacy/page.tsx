import type { Metadata } from "next";
import { List, Section, TextLink } from "@/components/legal-prose";
import { PageHero } from "@/components/page-hero";
import { absoluteUrl, PAGES, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGES.appPrivacy);

/*
 * The privacy policy for ZydanEditor, the owner's private tool that posts his
 * own videos to YouTube and Instagram. Google's YouTube API audit and Meta's
 * app settings link to this URL, so keep the path and the owner's wording.
 * The site's own policy lives at /privacy-policy.
 */

/* A legal page reads as plain prose: one column, no cards, no motion. */
export default function AppPrivacyPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero title="Privacy Policy" tone="violet" description="Last updated: October 27, 2026" />

      <article className="shell shell-y">
        <div className="max-w-2xl">
          <p className="text-xl leading-relaxed text-pretty text-white">
            SuperZydan (&ldquo;I&rdquo;, &ldquo;me&rdquo;) makes gaming videos. To post my own videos I use a private
            tool on my own computer (&ldquo;ZydanEditor&rdquo;). This policy explains what that tool does with data
            from YouTube and Instagram.
          </p>

          <Section title="Who uses it">
            <p>Only me, for my own YouTube channel and my own Instagram account. It is not offered to anyone else.</p>
          </Section>

          <Section title="What it accesses">
            <List>
              <li>
                YouTube (through the YouTube API Services): it uploads my videos to my own channel and sets their
                titles, descriptions, tags, thumbnails, captions and publish times, and checks the processing status of
                those uploads.
              </li>
              <li>
                Instagram and Facebook (through the Instagram Graph API): it posts my Reels with their captions to my
                own Instagram professional account, using my own Facebook Page&rsquo;s connection.
              </li>
            </List>
          </Section>

          <Section title="What it stores">
            <p>
              Only on my own computer: the login tokens (so I don&rsquo;t log in every time) and a log of which of my
              videos were posted where and when (so nothing is posted twice). It does not collect, store or use data
              about anyone else: no viewers&rsquo; data, comments, subscribers or other channels.
            </p>
          </Section>

          <Section title="Sharing">
            <p>No data is sold, shared or sent to anyone other than YouTube/Google and Instagram/Meta themselves.</p>
          </Section>

          <Section title="YouTube">
            <p>
              This tool uses YouTube API Services. By using it you agree to the YouTube Terms of Service (
              <TextLink href="https://www.youtube.com/t/terms" />
              ). Google&rsquo;s Privacy Policy applies to data handled by Google:{" "}
              <TextLink href="https://policies.google.com/privacy" />
            </p>
          </Section>

          <Section title="Removing access">
            <p>Access can be revoked at any time:</p>
            <List>
              <li>
                Google / YouTube: <TextLink href="https://myaccount.google.com/permissions" /> (remove &ldquo;ZydanEditor
                Uploader&rdquo;). You can also manage this at{" "}
                <TextLink href="https://security.google.com/settings/security/permissions" />
              </li>
              <li>
                Facebook / Instagram: Facebook Settings &gt; Business integrations (remove &ldquo;ZydanEditor
                Poster&rdquo;).
              </li>
            </List>
            <p>When access is removed, the stored tokens stop working; the local files are deleted on request.</p>
          </Section>

          <Section title="Contact">
            <p>
              <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
            </p>
          </Section>

          <Section title="Terms of Service">
            <p>
              ZydanEditor&rsquo;s Terms of Service: <TextLink href={PAGES.appTerms.path}>{absoluteUrl(PAGES.appTerms.path)}</TextLink>
            </p>
          </Section>
        </div>
      </article>
    </main>
  );
}

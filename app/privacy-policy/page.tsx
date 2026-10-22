import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { privacyPage } from "@/lib/pages";
import { PAGES, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGES.privacy);

/* A legal page reads as plain prose: one column, no cards, no motion. */
export default function PrivacyPolicyPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero title="Privacy policy" tone="violet" description={`Last updated ${privacyPage.updated}.`} />

      <article className="shell shell-y">
        <div className="max-w-2xl">
          <p className="text-xl leading-relaxed text-pretty text-white">{privacyPage.intro}</p>
          {privacyPage.sections.map((section) => (
            <section key={section.title} className="mt-12">
              <h2 className="text-2xl font-extrabold text-white">{section.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-pretty text-haze">{section.body}</p>
            </section>
          ))}
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold text-white">Questions</h2>
            <p className="mt-3 text-lg leading-relaxed text-pretty text-haze">
              Email{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold break-all text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 hover:text-white"
              >
                {site.email}
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { JournalComposer } from "@/components/pages/journal-composer";
import { seoMetadata } from "@/lib/seo";

/* My composer: not linked anywhere, kept out of search, and useless without the password. */
export const metadata: Metadata = seoMetadata({
  path: "/journal/new",
  title: "New Journal Entry | SuperZydan",
  description: "Write a new public journal entry.",
  noindex: true,
});

export default function NewJournalEntryPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        title="New entry"
        tone="violet"
        crumbs={[
          { name: "Journal", path: "/journal" },
          { name: "New entry", path: "/journal/new" },
        ]}
        description="This goes on your public journal. Publish it, then post the X version if you want."
      />
      <section className="shell shell-y">
        <div className="max-w-2xl">
          <JournalComposer />
        </div>
      </section>
    </main>
  );
}

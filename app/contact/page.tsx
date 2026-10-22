import type { Metadata } from "next";
import { ArrowRightIcon } from "lucide-react";
import { DiscordMark } from "@/components/discord-mark";
import { NeonButton } from "@/components/neon-button";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/pages/contact-form";
import { contactPage } from "@/lib/pages";
import { PAGES, pageMetadata } from "@/lib/seo";
import { discordInvite } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGES.contact);

const FIELDS = [
  { name: "name", label: "Your name", autoComplete: "name", required: true },
  { name: "email", label: "Your email", type: "email", autoComplete: "email", required: true, hint: "So I can write back." },
  { name: "message", label: "Message", type: "textarea", required: true },
] as const;

export default function ContactPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        title="Contact"
        tone="magenta"
        description="Questions, feedback, fan mail. It all lands in the same inbox."
      />

      <section className="shell shell-y">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <ContactForm fields={FIELDS} subject="Site message from {name}" />

          <div className="grid content-start gap-10">
            <div>
              <h2 className="font-display text-3xl leading-none font-black tracking-wide uppercase">Quicker answer?</h2>
              <p className="mt-3 text-pretty text-haze">
                Ask in the Discord. The mods and the community can usually help faster than email.
              </p>
              <NeonButton href={discordInvite} external variant="outline" className="mt-5">
                <DiscordMark className="size-4" />
                Join the Discord
              </NeonButton>
            </div>
            <div>
              <h2 className="font-display text-3xl leading-none font-black tracking-wide uppercase">Brands</h2>
              <p className="mt-3 text-pretty text-haze">
                Reach, audience, past collabs and a form made for partnerships are on the Work With Me page.
              </p>
              <NeonButton href="/work-with-me" variant="violet" className="mt-5">
                Work with me
                <ArrowRightIcon className="size-4" />
              </NeonButton>
            </div>
            <div>
              <h2 className="font-display text-3xl leading-none font-black tracking-wide uppercase">Email</h2>
              <p className="mt-3 text-haze">{contactPage.company}</p>
              <a
                href={`mailto:${contactPage.email}`}
                className="inline-flex min-h-11 items-center font-semibold break-all text-neon-cyan transition-colors hover:text-white"
              >
                {contactPage.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

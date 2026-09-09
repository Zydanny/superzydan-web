import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { SpotlightCard } from "@/components/spotlight-card";
import { ShimmerButton } from "@/components/shimmer-button";
import { Reveal } from "@/components/motion/reveal";
import {
  keyboardReview,
  keyboardReviewBody,
  KEYBOARD_PRODUCT_URL,
  KEYBOARD_THUMB,
  KEYBOARD_YOUTUBE_ID,
  KEYBOARD_YOUTUBE_URL,
} from "@/lib/reviews";

export const metadata: Metadata = {
  title: keyboardReview.title,
  description: keyboardReview.excerpt,
};

export default function KeyboardReviewPage() {
  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow={`${keyboardReview.tag} · Product Review`}
        title={keyboardReview.title}
        description={keyboardReview.excerpt}
      />

      <Section divider={false}>
        <Reveal>
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-muted">
            <Image
              src={KEYBOARD_THUMB}
              alt="Unboxing the Gateron × SIKAKEYB FNP75 HE"
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_0.8fr]">
          <Reveal>
            <article className="space-y-5 text-base leading-relaxed text-muted-foreground">
              {keyboardReviewBody.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </article>
            <div className="mt-8 flex flex-wrap gap-3">
              <ShimmerButton href={KEYBOARD_YOUTUBE_URL} external>
                Watch the unboxing
              </ShimmerButton>
              <ShimmerButton href={KEYBOARD_PRODUCT_URL} external>
                Shop the FNP75 HE
              </ShimmerButton>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <SpotlightCard className="p-6">
              <p className="text-eyebrow text-primary">On the desk</p>
              <h2 className="text-display mt-3 text-xl">{keyboardReview.productName}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Color: {keyboardReview.color} · Not sponsored
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {keyboardReview.specs.map((spec) => (
                  <li
                    key={spec}
                    className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {spec}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        </div>

        <Reveal className="mt-10">
          <div className="overflow-hidden rounded-3xl border border-border bg-muted">
            <iframe
              title="Gateron × SIKAKEYB FNP75 HE unboxing"
              src={`https://www.youtube.com/embed/${KEYBOARD_YOUTUBE_ID}`}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Reveal>
      </Section>
    </main>
  );
}

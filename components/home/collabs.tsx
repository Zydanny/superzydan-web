import { ArrowRightIcon } from "lucide-react";
import { CollabPlates } from "@/components/collab-plates";
import { NeonButton } from "@/components/neon-button";
import { SignHeading } from "@/components/sign-heading";

/*
 * The brands' way in from the home page: who I've worked with as a strip of
 * name plates, then the Work With Me page.
 */
export function Collabs() {
  return (
    <section aria-labelledby="collabs-title" className="render-later shell shell-y">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
        <div>
          <SignHeading
            id="collabs-title"
            tone="cyan"
            size="md"
            sub="Brands I've teamed up with, from the DreamHack show floor to my own kitchen."
          >
            Worked with
          </SignHeading>
          <NeonButton href="/work-with-me" variant="outline" className="mt-7">
            Work with me
            <ArrowRightIcon className="size-4" />
          </NeonButton>
        </div>

        <CollabPlates className="lg:justify-end" />
      </div>
    </section>
  );
}

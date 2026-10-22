import type { CSSProperties } from "react";
import { ArrowRightIcon } from "lucide-react";
import { NeonButton } from "@/components/neon-button";
import { SignHeading } from "@/components/sign-heading";
import { partners } from "@/lib/site";

/*
 * The brands' way in from the home page: who I've worked with, then the Work
 * With Me page. Names are set as plates, not logos (no logo files supplied),
 * and they aren't links, so nobody lands on a shop page by accident.
 */
export function Collabs() {
  return (
    <section aria-labelledby="collabs-title" className="shell shell-y">
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

        <ul className="grid grid-cols-2 gap-3 sm:gap-4">
          {partners.map((partner, index) => (
            <li key={partner.name} className="build-in" style={{ "--i": index } as CSSProperties}>
              <div className="chamfer h-full bg-neon-violet/45 p-[2px] [--cut:12px]">
                <div className="chamfer flex h-full min-h-28 flex-col justify-between gap-3 bg-night-raised p-4 [--cut:11px] sm:p-5">
                  <p className="font-display text-2xl leading-none font-black tracking-wide uppercase sm:text-3xl">
                    {partner.name}
                  </p>
                  <p className="text-sm font-semibold text-haze">{partner.note}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

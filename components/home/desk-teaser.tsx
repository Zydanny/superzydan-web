import Image from "next/image";
import { ArrowRightIcon, ShoppingBagIcon } from "lucide-react";
import { NeonButton } from "@/components/neon-button";
import { SignHeading } from "@/components/sign-heading";
import { affiliateDisclosure } from "@/lib/site";
import { STOREFRONT_URL } from "@/lib/pages";

/* The real desk, short. The full parts list lives on /setup. */
const DESK = [
  { label: "PC", value: "Intel i9-13900K, RTX 4090, 64 GB DDR5" },
  { label: "Keyboard", value: "Gateron × SIKAKEYB FNP75 HE with Magnetic Jade Ultras" },
  { label: "Camera", value: "Sony a6000 with a Sigma 16mm f/1.4" },
  { label: "Mics", value: "Hollyland Lark M2" },
];

/*
 * Gear and the storefront in one block: a desk photo that drifts a little as
 * it scrolls, the four things people ask about, and the two ways to shop.
 */
export function DeskTeaser() {
  return (
    <section aria-labelledby="desk-title" className="shell shell-y">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
        <div className="chamfer build-in bg-neon-cyan/70 p-[2px] [--cut:16px] lg:order-last">
          <div className="chamfer relative aspect-[4/3] overflow-hidden bg-night-raised [--cut:15px]">
            <Image
              src="/images/setup/pc-build-1.webp"
              alt="SuperZydan's desk: two curved monitors, key lights, the white PC and a Superman gaming chair"
              fill
              sizes="(min-width: 1024px) 40rem, 100vw"
              className="parallax-photo object-cover"
            />
          </div>
        </div>

        <div>
          <SignHeading id="desk-title" tone="violet" size="md" sub="What's actually on my desk right now.">
            On the desk
          </SignHeading>

          <dl className="mt-8 divide-y divide-neon-violet/25 border-y border-neon-violet/25">
            {DESK.map((item) => (
              <div key={item.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-3.5 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <dt className="font-display text-xl leading-tight font-black tracking-wide text-neon-cyan uppercase">
                  {item.label}
                </dt>
                <dd className="text-pretty text-white">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <NeonButton href="/setup">
              Full setup
              <ArrowRightIcon className="size-4" />
            </NeonButton>
            <NeonButton href={STOREFRONT_URL} external variant="outline">
              <ShoppingBagIcon className="size-4" />
              Amazon storefront
            </NeonButton>
          </div>
          <p className="mt-5 max-w-lg text-sm text-pretty text-haze">{affiliateDisclosure}</p>
        </div>
      </div>
    </section>
  );
}

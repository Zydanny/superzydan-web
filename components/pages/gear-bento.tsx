import { ArrowUpRightIcon } from "lucide-react";
import { SpotlightCard } from "@/components/spotlight-card";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import type { SetupItem } from "@/lib/pages";

export function GearBento({ items }: { items: SetupItem[] }) {
  return (
    <StaggerGroup className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <StaggerItem
          key={item.title}
          className={item.wide ? "md:col-span-2 lg:col-span-1" : undefined}
        >
          <SpotlightCard className="flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-display text-lg">{item.title}</h3>
                <p className="text-eyebrow mt-1.5 text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-1.5">
                {item.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {item.blurb}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {item.specs.map((spec) => (
                <li
                  key={spec}
                  className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {spec}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {item.cta}
                <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </SpotlightCard>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

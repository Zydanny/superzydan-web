import { ArrowUpRightIcon } from "lucide-react";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import { SpotlightCard } from "@/components/spotlight-card";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { partners } from "@/lib/site";

export function Partners() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Collabs"
        title="Companies I've worked with"
        align="center"
      />

      <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((partner) => (
          <StaggerItem key={partner.name}>
            <a
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block h-full"
            >
              <SpotlightCard className="group/card flex h-32 items-center justify-center p-4">
                <span className="text-center text-sm font-medium text-muted-foreground transition-colors group-hover/card:text-foreground">
                  {partner.name}
                </span>
                <ArrowUpRightIcon className="absolute top-3 right-3 size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover/card:opacity-100" />
              </SpotlightCard>
            </a>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}

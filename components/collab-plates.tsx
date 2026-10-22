import { cn } from "cn";
import { partners } from "@/lib/site";

/* A slight lean on each plate, like stickers slapped on a wall. Static, never animated. */
const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

/*
 * Past collabs as one strip of sticker name plates, the same build as the
 * SUPERZYDAN / LINKNOVA plates in the hero: a chamfered magenta or cyan rim, the
 * name in sign caps, what it was underneath. Names only, no logos (none were
 * supplied). Each plate links to the brand's official site, never a shop or
 * affiliate page. The link wraps the chamfers so clip-path never clips the
 * focus ring.
 */
export function CollabPlates({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-5 sm:gap-x-6", className)}>
      {partners.map((partner, index) => (
        <li key={partner.name} className={TILT[index % TILT.length]}>
          <a href={partner.href} target="_blank" rel="noopener noreferrer" className="group block">
            <div className={cn("chamfer p-[2px] [--cut:9px]", index % 2 === 0 ? "bg-neon-magenta" : "bg-neon-cyan")}>
              <p className="chamfer bg-night-raised px-4 py-2 transition-colors duration-200 [--cut:8px] group-hover:bg-[#0b1a22]">
                <span className="font-display block text-2xl leading-none font-black tracking-wide uppercase sm:text-3xl">
                  {partner.name}
                </span>
                <span className="mt-1 block text-xs font-bold tracking-[0.14em] text-haze uppercase">{partner.note}</span>
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

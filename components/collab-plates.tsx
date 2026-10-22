import { cn } from "cn";
import { partners } from "@/lib/site";

/* A slight lean on each plate, like stickers slapped on a wall. Static, never animated. */
const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

/*
 * Past collabs as one strip of sticker name plates, the same build as the
 * SUPERZYDAN / LINKNOVA plates in the hero: a chamfered magenta or cyan rim, the
 * name in sign caps, what it was underneath. Names only, no logos (none were
 * supplied), and not links, so nobody lands on a shop page by accident.
 */
export function CollabPlates({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-5 sm:gap-x-6", className)}>
      {partners.map((partner, index) => (
        <li key={partner.name} className={TILT[index % TILT.length]}>
          <div className={cn("chamfer p-[2px] [--cut:9px]", index % 2 === 0 ? "bg-neon-magenta" : "bg-neon-cyan")}>
            <p className="chamfer bg-night-raised px-4 py-2 [--cut:8px]">
              <span className="font-display block text-2xl leading-none font-black tracking-wide uppercase sm:text-3xl">
                {partner.name}
              </span>
              <span className="mt-1 block text-xs font-bold tracking-[0.14em] text-haze uppercase">{partner.note}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

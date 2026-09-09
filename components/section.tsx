import type { ReactNode } from "react";
import { cn } from "cn";
import { SectionDivider } from "@/components/motion/section-divider";

/*
 * Shared vertical rhythm for every homepage block. Keeping the padding in one
 * place stops sections from drifting apart, and the divider gives each seam
 * something to animate instead of an empty gap.
 */
export function Section({
  id,
  children,
  className,
  divider = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  divider?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative shell shell-y",
        className,
      )}
    >
      {divider ? <SectionDivider /> : null}
      {children}
    </section>
  );
}

import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mb-10 text-center" : "mb-10"}>
      <div
        className={
          align === "center"
            ? "mx-auto flex max-w-3xl flex-col items-center"
            : "max-w-3xl"
        }
      >
        <span className="text-eyebrow inline-flex items-center gap-2 text-primary">
          <span className="size-1 rounded-full bg-primary shadow-[0_0_8px_var(--glow-emerald)]" />
          {eyebrow}
        </span>
        <h2 className="text-display mt-3 text-3xl font-extrabold tracking-tight lg:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-lg leading-relaxed text-zinc-300 lg:text-xl">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

import type { ReactNode } from "react";

/*
 * Building blocks for the plain-prose legal pages (/privacy, /terms): one
 * column, h2 sections, cyan text links. Web links open in a new tab; mail and
 * on-site links don't.
 */

export function TextLink({ href, children }: { href: string; children?: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="font-semibold break-all text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 hover:text-white"
    >
      {children ?? href}
    </a>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-lg leading-relaxed text-pretty text-haze">{children}</div>
    </section>
  );
}

export function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6 marker:text-neon-violet">{children}</ul>;
}

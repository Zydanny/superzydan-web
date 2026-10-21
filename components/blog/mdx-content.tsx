import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ComponentPropsWithoutRef } from "react";
import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import { evaluate } from "@mdx-js/mdx";
import { imageSize } from "image-size";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import { ArrowUpRightIcon } from "lucide-react";
import { YouTubeEmbed } from "@/components/blog/youtube-embed";
import { isAffiliateUrl } from "@/lib/affiliate";

/*
 * Local images are sized from the file itself so the page doesn't jump while
 * they load, and the post's Markdown can stay a plain ![alt](/blog/...) line.
 */
async function localImageSize(src: string) {
  if (!src.startsWith("/")) return null;
  try {
    const { width, height } = imageSize(await readFile(path.join(process.cwd(), "public", decodeURI(src))));
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}

async function PostImage({ src, alt }: ComponentPropsWithoutRef<"img">) {
  if (typeof src !== "string" || !src) return null;

  const size = await localImageSize(src);
  if (!size) {
    // eslint-disable-next-line @next/next/no-img-element -- size unknown; next/image needs one
    return <img src={src} alt={alt ?? ""} loading="lazy" className="my-8 w-full rounded-2xl" />;
  }

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={size.width}
      height={size.height}
      sizes="(max-width: 768px) 100vw, 768px"
      className="my-8 h-auto w-full rounded-2xl border border-border"
    />
  );
}

function PostLink({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  const rel = external
    ? isAffiliateUrl(href)
      ? "sponsored nofollow noopener noreferrer"
      : "noopener noreferrer"
    : undefined;

  return (
    <a
      {...rest}
      href={href}
      target={external ? "_blank" : undefined}
      rel={rel}
      className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
    >
      {children}
    </a>
  );
}

function TikTok({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-8 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 font-medium transition-colors hover:border-primary/50"
    >
      Watch this one on TikTok
      <ArrowUpRightIcon className="size-5 shrink-0 text-primary" />
    </a>
  );
}

const components: MDXComponents = {
  h2: (props) => <h2 className="text-display mt-12 mb-4 text-2xl font-bold tracking-tight sm:text-3xl" {...props} />,
  h3: (props) => <h3 className="mt-10 mb-3 text-xl font-semibold tracking-tight" {...props} />,
  h4: (props) => <h4 className="mt-8 mb-2 text-lg font-semibold" {...props} />,
  p: (props) => <p className="my-5 leading-relaxed text-zinc-300" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-6 text-zinc-300 marker:text-primary" {...props} />,
  ol: (props) => <ol className="my-5 list-decimal space-y-2 pl-6 text-zinc-300 marker:text-primary" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-zinc-100" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-6 border-l-2 border-primary pl-5 text-zinc-300 italic" {...props} />
  ),
  hr: () => <hr className="my-10 border-border" />,
  table: (props) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-border bg-muted/50 px-4 py-3 font-semibold" {...props} />,
  td: (props) => <td className="border-b border-border px-4 py-3 text-zinc-300" {...props} />,
  a: PostLink,
  img: PostImage,
  YouTube: ({ id, short }: { id: string; short?: boolean }) => <YouTubeEmbed id={id} short={short} />,
  TikTok,
};

export async function MdxContent({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
  });

  return <Content components={components} />;
}

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
import { isAffiliateUrl, withAssociateTag } from "@/lib/affiliate";

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
    return <img src={src} alt={alt ?? ""} loading="lazy" className="my-8 w-full" />;
  }

  return (
    // A span, not a div: Markdown puts images inside paragraphs.
    <span className="chamfer my-8 block bg-neon-violet/40 p-[2px] [--cut:12px]">
      <Image
        src={src}
        alt={alt ?? ""}
        width={size.width}
        height={size.height}
        sizes="(max-width: 768px) 100vw, 768px"
        className="chamfer h-auto w-full [--cut:11px]"
      />
    </span>
  );
}

function PostLink({ href: rawHref = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const href = withAssociateTag(rawHref);
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
      className="font-semibold text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
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
      className="group/tt chamfer my-8 flex min-h-14 items-center justify-between gap-4 bg-neon-violet/40 p-[2px] font-semibold [--cut:10px]"
    >
      <span className="chamfer flex w-full items-center justify-between gap-4 bg-night-raised px-5 py-4 transition-colors [--cut:9px] group-hover/tt:bg-[#1a1030]">
        Watch this one on TikTok
        <ArrowUpRightIcon className="size-5 shrink-0 text-neon-cyan" />
      </span>
    </a>
  );
}

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-14 mb-4 text-2xl leading-tight font-extrabold tracking-[-0.015em] text-balance text-white sm:text-3xl" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 mb-3 text-xl font-bold text-balance text-white" {...props} />,
  h4: (props) => <h4 className="mt-8 mb-2 text-lg font-bold text-white" {...props} />,
  p: (props) => <p className="my-5 leading-relaxed text-pretty text-haze" {...props} />,
  ul: (props) => <ul className="my-5 list-disc space-y-2 pl-6 text-haze marker:text-neon-magenta" {...props} />,
  ol: (props) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-haze marker:font-bold marker:text-neon-magenta" {...props} />
  ),
  li: (props) => <li className="pl-1 leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-bold text-white" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-8 border-y border-neon-violet/35 py-4 text-lg text-white italic" {...props} />
  ),
  hr: () => <hr className="my-12 border-neon-violet/25" />,
  table: (props) => (
    <div className="my-8 overflow-x-auto border border-neon-violet/30">
      <table className="w-full text-left text-sm tabular-nums" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-neon-violet/30 bg-night-raised px-4 py-3 font-bold text-white" {...props} />,
  td: (props) => <td className="border-b border-neon-violet/15 px-4 py-3 text-haze" {...props} />,
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

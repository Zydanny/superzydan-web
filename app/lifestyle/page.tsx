import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { VlogFeed } from "@/components/home/vlog-feed";
import { lifestyleIntro } from "@/lib/pages";
import { mergeLifestylePosts } from "@/lib/reviews";
import { vlogPosts } from "@/lib/site";
import { getVlogPosts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "LifeStyle",
  description: lifestyleIntro,
};

export const revalidate = 1800;

export default async function LifestylePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const params = await searchParams;
  const tag = Array.isArray(params.tag) ? params.tag[0] : params.tag;
  const live = await getVlogPosts(12);
  const posts = mergeLifestylePosts(live.length > 0 ? live : vlogPosts);
  const initialTag =
    tag && posts.some((post) => post.tag === tag) ? tag : "All";

  return (
    <main id="content" className="flex-1">
      <PageHero
        eyebrow="LifeStyle"
        title="Recipes, reviews, and kitchen chaos"
        description={lifestyleIntro}
      />
      <VlogFeed posts={posts} heading={false} initialTag={initialTag} />
    </main>
  );
}

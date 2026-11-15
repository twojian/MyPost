import type { Metadata } from "next";
import PostList from "@/components/post/PostList";
import TagBadge from "@/components/ui/TagBadge";
import { getAllPosts, getAllTags } from "@/lib/posts";

interface Props {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `# ${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getAllPosts().filter((p) => p.tags.includes(decoded));

  return (
    <>
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-fg">
        <TagBadge name={decoded} size="lg" count={posts.length} showLink={false} />
      </h1>
      <PostList posts={posts} emptyText="该标签下暂无文章" />
    </>
  );
}

import type { Metadata } from "next";
import PostCard from "@/components/post/PostCard";
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
      <h1 className="mb-6 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        # {decoded}
        <span className="ml-2 text-base font-normal" style={{ color: "var(--color-secondary)" }}>
          ({posts.length} 篇)
        </span>
      </h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}

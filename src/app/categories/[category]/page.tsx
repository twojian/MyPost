import type { Metadata } from "next";
import PostCard from "@/components/post/PostCard";
import { getAllPosts, getAllCategories } from "@/lib/posts";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: decodeURIComponent(category) };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const posts = getAllPosts().filter((p) => p.categories.includes(decoded));

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        {decoded}
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

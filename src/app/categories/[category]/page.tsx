import type { Metadata } from "next";
import PostList from "@/components/post/PostList";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import { getCategoryMeta } from "@/lib/category-meta";

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
  const { icon: Icon, color } = getCategoryMeta(decoded);

  return (
    <>
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-fg">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
          style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
        >
          <Icon size={18} strokeWidth={2.1} />
        </span>
        {decoded}
        <span className="ml-2 text-base font-normal text-muted">
          ({posts.length} 篇)
        </span>
      </h1>
      <PostList posts={posts} emptyText="该分类下暂无文章" />
    </>
  );
}

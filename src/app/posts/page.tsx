import type { Metadata } from "next";
import PostDateList from "@/components/post/PostDateList";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "所有文章" };

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        所有文章
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--color-secondary)" }}>
        按日、周、月、年或分类浏览文章。
      </p>
      <PostDateList posts={posts} />
    </>
  );
}

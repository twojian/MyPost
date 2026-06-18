import type { Metadata } from "next";
import PostGroupList from "@/components/post/PostGroupList";
import { getPostGroups } from "@/lib/posts";

export const metadata: Metadata = { title: "所有文章" };

export default function PostsPage() {
  const groups = getPostGroups();

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        所有文章
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--color-secondary)" }}>
        按照笔记本分组，点击标题展开 / 收起对应章节。
      </p>
      <PostGroupList groups={groups} />
    </>
  );
}

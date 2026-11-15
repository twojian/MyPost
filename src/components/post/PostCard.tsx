import Link from "next/link";
import type { PostMeta as PostMetaData } from "@/lib/posts";
import PostMeta from "@/components/post/PostMeta";

/** 列表卡片：元信息（日期 · 阅读时长 · 字数 · 标签）统一由 PostMeta 渲染 */
export default function PostCard({ post }: { post: PostMetaData }) {
  return (
    <Link href={`/posts/${post.slug}`} className="press block">
      <article className="glass-card px-6 py-5">
        <h2 className="mb-2 text-lg font-semibold text-fg">{post.title}</h2>

        {post.summary && (
          <p className="mb-3 line-clamp-2 text-sm text-muted">{post.summary}</p>
        )}

        <PostMeta
          date={post.date}
          readingTime={post.readingTime}
          wordCount={post.wordCount}
          tags={post.tags}
          size="sm"
          tagLinks={false}
        />
      </article>
    </Link>
  );
}

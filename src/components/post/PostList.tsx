import type { PostMeta } from "@/lib/posts";
import PostCard from "@/components/post/PostCard";

interface Props {
  posts: PostMeta[];
  /** 空态文案（标签页 / 分类页共用） */
  emptyText?: string;
}

/** 文章卡片列表：标签页、分类页等聚合页共用，避免各写一份 map + 容器样式 */
export default function PostList({ posts, emptyText = "暂无文章" }: Props) {
  if (posts.length === 0) {
    return <p className="text-sm text-muted">{emptyText}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

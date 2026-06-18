import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import TagBadge from "@/components/ui/TagBadge";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <article className="glass-card px-6 py-5">
        <h2
          className="mb-2 text-lg font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {post.title}
        </h2>

        {post.summary && (
          <p
            className="mb-3 line-clamp-2 text-sm"
            style={{ color: "var(--color-secondary)" }}
          >
            {post.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--color-secondary)" }}>
          <time>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
          <span>·</span>
          <span>{post.wordCount} 字</span>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} name={tag} showLink={false} />
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}

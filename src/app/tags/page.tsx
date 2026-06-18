import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = { title: "标签" };

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        标签
      </h1>
      <div className="glass-card-static flex flex-wrap gap-3 p-6">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${tag.name}`}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-transform hover:scale-105"
              style={{
                background: "rgba(53, 191, 171, 0.15)",
                color: "var(--color-brand)",
              }}
            >
              # {tag.name}
              <span
                className="rounded-full px-1.5 py-0.5 text-xs"
                style={{ background: "rgba(53, 191, 171, 0.2)" }}
              >
                {tag.count}
              </span>
            </Link>
          ))
        ) : (
          <p style={{ color: "var(--color-secondary)" }}>暂无标签</p>
        )}
      </div>
    </>
  );
}

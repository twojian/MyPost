import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "归档" };

export default function ArchivesPage() {
  const posts = getAllPosts();

  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = post.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        归档
        <span className="ml-2 text-base font-normal" style={{ color: "var(--color-secondary)" }}>
          (共 {posts.length} 篇)
        </span>
      </h1>

      <div className="glass-card-static p-6">
        {years.map((year) => (
          <div key={year} className="mb-8 last:mb-0">
            <h2
              className="mb-4 text-lg font-bold"
              style={{ color: "var(--color-brand)" }}
            >
              {year}
            </h2>
            <ul className="space-y-3">
              {grouped[year].map((post) => (
                <li key={post.slug} className="flex items-baseline gap-4">
                  <time
                    className="shrink-0 text-sm tabular-nums"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    {formatDate(post.date)}
                  </time>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm transition-colors hover:text-[var(--color-brand)]"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

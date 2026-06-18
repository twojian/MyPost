"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import { Search } from "lucide-react";

interface SearchPost {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
}

export default function SearchClient({ posts }: { posts: SearchPost[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "summary", "tags"],
        threshold: 0.4,
        distance: 1000,
      }),
    [posts]
  );

  const results = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : posts;

  return (
    <>
      <h1
        className="mb-6 text-2xl font-bold"
        style={{ color: "var(--color-primary)" }}
      >
        搜索
      </h1>

      <div className="glass-card-static mb-6 flex items-center gap-3 px-4 py-3">
        <Search size={18} style={{ color: "var(--color-secondary)" }} />
        <input
          type="text"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-secondary)]"
          style={{ color: "var(--color-primary)" }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {results.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="glass-card block px-5 py-4"
          >
            <h3
              className="mb-1 text-base font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {post.title}
            </h3>
            {post.summary && (
              <p
                className="line-clamp-1 text-sm"
                style={{ color: "var(--color-secondary)" }}
              >
                {post.summary}
              </p>
            )}
          </Link>
        ))}
        {results.length === 0 && query.trim() && (
          <p
            className="py-8 text-center text-sm"
            style={{ color: "var(--color-secondary)" }}
          >
            没有找到匹配的文章
          </p>
        )}
      </div>
    </>
  );
}

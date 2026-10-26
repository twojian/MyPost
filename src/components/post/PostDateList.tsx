"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format, getWeek, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { PostMeta } from "@/lib/posts";

type GroupMode = "day" | "week" | "month" | "year" | "category";

const MODES: { key: GroupMode; label: string }[] = [
  { key: "day", label: "日" },
  { key: "week", label: "周" },
  { key: "month", label: "月" },
  { key: "year", label: "年" },
  { key: "category", label: "分类" },
];

interface Group {
  key: string;
  label: string;
  posts: PostMeta[];
}

const compactDate = (date: string) => format(parseISO(date), "yyyy-MM-dd");

function groupKey(
  mode: GroupMode,
  date: string,
  categories: string[]
): { key: string; label: string } {
  const d = parseISO(date);
  switch (mode) {
    case "day":
      return { key: date, label: format(d, "yyyy 年 M 月 d 日", { locale: zhCN }) };
    case "week": {
      const week = getWeek(d, { weekStartsOn: 1 });
      return {
        key: `${d.getFullYear()}-W${String(week).padStart(2, "0")}`,
        label: `${d.getFullYear()} 年 第 ${week} 周`,
      };
    }
    case "month":
      return { key: date.slice(0, 7), label: format(d, "yyyy 年 M 月", { locale: zhCN }) };
    case "year":
      return { key: date.slice(0, 4), label: `${date.slice(0, 4)} 年` };
    case "category":
      return { key: categories[0] ?? "未分类", label: categories[0] ?? "未分类" };
  }
}

export default function PostDateList({ posts }: { posts: PostMeta[] }) {
  const [mode, setMode] = useState<GroupMode>("year");

  const groups = useMemo(() => {
    const map = new Map<string, Group>();
    for (const post of posts) {
      const { key, label } = groupKey(mode, post.date, post.categories);
      const group = map.get(key) ?? { key, label, posts: [] };
      group.posts.push(post);
      map.set(key, group);
    }
    const list = Array.from(map.values());
    if (mode === "category") {
      return list.sort((a, b) => b.posts.length - a.posts.length);
    }
    return list.sort((a, b) => b.key.localeCompare(a.key));
  }, [posts, mode]);

  return (
    <div className="flex flex-col gap-5">
      {/* Apple 风格分段切换 */}
      <div
        className="inline-flex items-center gap-1 self-start rounded-full p-1"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
      >
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className="press rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            style={
              mode === key
                ? { background: "var(--color-brand)", color: "#fff" }
                : { color: "var(--color-secondary)" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <div
          key={g.key}
          className="glass-card-static squircle overflow-hidden"
          style={{ borderRadius: "32px" }}
        >
          <div className="flex items-center gap-2 px-5 py-4">
            <p
              className="reveal text-base font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {g.label}
            </p>
            <span className="text-xs" style={{ color: "var(--color-secondary)" }}>
              {g.posts.length} 篇文章
            </span>
          </div>

          <ul className="flex flex-col gap-0.5 px-3 pb-3">
            {g.posts.map((post, i) => (
              <li
                key={post.slug}
                className="reveal"
                style={{ transitionDelay: `${Math.min(i, 5) * 50}ms` }}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="timeline-link group flex items-center rounded-2xl px-2 py-2.5"
                >
                  <time
                    className="shrink-0 pr-1 text-right text-xs tabular-nums"
                    style={{ color: "var(--color-tertiary)", minWidth: "4.5rem" }}
                  >
                    {compactDate(post.date)}
                  </time>
                  <span className="timeline-track" aria-hidden="true">
                    <span className="timeline-dot" />
                  </span>
                  <span className="line-clamp-1 flex-1 px-2 text-sm text-[var(--color-primary)] transition-colors duration-150 group-hover:text-[var(--color-brand)]">
                    {post.title}
                  </span>
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="shrink-0 text-xs font-medium"
                      style={{ color: "var(--color-brand)" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { CATEGORY_CLASS, type ShareItem } from "@/lib/share";

const CATEGORIES = ["全部", ...Object.keys(CATEGORY_CLASS)];

function glyph(title: string) {
  return title.trim().charAt(0).toUpperCase();
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ShareClient({ items }: { items: ShareItem[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("全部");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = active === "全部" || item.category === active;
      if (!matchCat) return false;
      if (!q) return true;
      return [item.title, item.author, item.category, item.desc ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, active]);

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold text-fg">
        分享
      </h1>
      <p className="mb-6 text-sm text-muted">
        按知识大类整理的优质文章与专栏，来自杜子源、二丫讲梵、阮一峰及博客圈的各位朋友。点击卡片直达原文。
      </p>

      {/* 搜索框 */}
      <div className="glass-card-static mb-4 flex items-center gap-3 px-4 py-3">
        <Search size={18} className="text-muted" />
        <input
     type="text"
     placeholder="搜索标题、作者或分类..."
     value={query}
     onChange={(e) => setQuery(e.target.value)}
     className="w-full bg-transparent text-sm outline-none placeholder:text-muted text-fg"
    />
      </div>

      {/* 分类 chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const catClass = CATEGORY_CLASS[cat] ?? "";
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`share-cat ${catClass} rounded-full px-3 py-1.5 text-xs transition-all duration-200 hover:-translate-y-0.5 ${
                isActive ? "share-chip-active" : "share-chip"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 卡片网格 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <ShareCard key={item.title + item.url} item={item} delay={i * 40} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-muted">
          没有找到匹配的内容
        </p>
      )}
    </>
  );
}

function ShareCard({ item, delay }: { item: ShareItem; delay: number }) {
  const catClass = CATEGORY_CLASS[item.category] ?? "";

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`share-cat ${catClass} reveal glass-card squircle group flex flex-col overflow-hidden`}
      style={{ transitionDelay: `${Math.min(delay, 240)}ms` }}
    >
      {/* 封面：分类渐变色块 */}
      <div className="share-cover relative flex h-28 items-center justify-center overflow-hidden">
        <span
          className="font-display select-none text-6xl text-[var(--color-hairline)] transition-transform duration-300 group-hover:scale-110"
          aria-hidden
        >
          {glyph(item.title)}
        </span>

        <span
          className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-medium text-onbrand"
          style={{ background: "var(--color-scrim)", backdropFilter: "blur(8px)" }}
        >
          {item.type}
        </span>

        <span
          className="absolute bottom-3 left-3 rounded-full px-2 py-0.5 text-[10px] font-medium text-onbrand"
          style={{ background: "var(--color-scrim)", backdropFilter: "blur(8px)" }}
        >
          {item.category}
        </span>
      </div>

      {/* 内容 */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <p
      className="line-clamp-2 text-base font-semibold leading-snug text-fg"
    >
            {item.title}
          </p>
          <ExternalLink
      size={14}
      className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-muted"
     />
        </div>

        <p className="share-accent w-fit text-xs">
          {item.author} · {hostOf(item.authorUrl)}
        </p>

        {item.desc && (
          <p
      className="line-clamp-2 text-xs leading-relaxed text-muted"
    >
            {item.desc}
          </p>
        )}
      </div>
    </a>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { CATEGORY_STYLE, SHARE_ITEMS, type ShareItem } from "@/lib/share";

const CATEGORIES = ["全部", ...Object.keys(CATEGORY_STYLE)];

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

export default function ShareClient() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("全部");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SHARE_ITEMS.filter((item) => {
      const matchCat = active === "全部" || item.category === active;
      if (!matchCat) return false;
      if (!q) return true;
      return [item.title, item.author, item.category, item.desc ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, active]);

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        分享
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--color-secondary)" }}>
        按知识大类整理的优质文章与专栏，来自杜子源、二丫讲梵、阮一峰及博客圈的各位朋友。点击卡片直达原文。
      </p>

      {/* 搜索框 */}
      <div className="glass-card-static mb-4 flex items-center gap-3 px-4 py-3">
        <Search size={18} style={{ color: "var(--color-secondary)" }} />
        <input
          type="text"
          placeholder="搜索标题、作者或分类..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-secondary)]"
          style={{ color: "var(--color-primary)" }}
        />
      </div>

      {/* 分类 chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const style = cat === "全部" ? undefined : CATEGORY_STYLE[cat];
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className="rounded-full px-3 py-1.5 text-xs transition-all duration-200 hover:-translate-y-0.5"
              style={
                isActive
                  ? {
                      background: style?.accent ?? "var(--color-brand)",
                      color: "#fff",
                      boxShadow: `0 4px 12px ${style?.accent ?? "var(--color-brand)"}33`,
                    }
                  : {
                      background: `${style?.accent ?? "var(--color-brand)"}1a`,
                      color: style?.accent ?? "var(--color-brand)",
                      border: "1px solid var(--color-border)",
                    }
              }
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
        <p className="py-10 text-center text-sm" style={{ color: "var(--color-secondary)" }}>
          没有找到匹配的内容
        </p>
      )}
    </>
  );
}

function ShareCard({ item, delay }: { item: ShareItem; delay: number }) {
  const cover = CATEGORY_STYLE[item.category];

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="reveal glass-card squircle group flex flex-col overflow-hidden"
      style={{ borderRadius: "24px", transitionDelay: `${Math.min(delay, 240)}ms` }}
    >
      {/* 封面：分类渐变色块 */}
      <div
        className="relative flex h-28 items-center justify-center overflow-hidden"
        style={{ background: cover ? `linear-gradient(135deg, ${cover.from}, ${cover.to})` : "var(--color-brand)" }}
      >
        <span
          className="font-display select-none text-6xl text-white/25 transition-transform duration-300 group-hover:scale-110"
          aria-hidden
        >
          {glyph(item.title)}
        </span>

        <span
          className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
          style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)" }}
        >
          {item.type}
        </span>

        <span
          className="absolute bottom-3 left-3 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
          style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)" }}
        >
          {item.category}
        </span>
      </div>

      {/* 内容 */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <p
            className="line-clamp-2 text-base font-semibold leading-snug"
            style={{ color: "var(--color-primary)" }}
          >
            {item.title}
          </p>
          <ExternalLink
            size={14}
            className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            style={{ color: "var(--color-secondary)" }}
          />
        </div>

        <p className="w-fit text-xs" style={{ color: cover?.accent ?? "var(--color-brand)" }}>
          {item.author} · {hostOf(item.authorUrl)}
        </p>

        {item.desc && (
          <p
            className="line-clamp-2 text-xs leading-relaxed"
            style={{ color: "var(--color-secondary)" }}
          >
            {item.desc}
          </p>
        )}
      </div>
    </a>
  );
}

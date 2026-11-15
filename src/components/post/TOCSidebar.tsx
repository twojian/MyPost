"use client";

import { useEffect, useState } from "react";

interface Heading {
  depth: number;
  text: string;
  id: string;
}

export default function TOCSidebar({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0% -65% 0%", threshold: 0 }
    );

    const els = document.querySelectorAll("article h1, article h2, article h3, article h4");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  // Keep only top-level chapters (h2) and their sub-sections (h3).
  // 优先取 h2 章节 + h3 小节；若正文一级标题（h1）直接分节、没有 h2/h3
  // （如 408 笔记、部分长文），退回"最浅一级 + 其下一级"，避免整块目录消失。
  const hasChapterLevel = headings.some((h) => h.depth === 2 || h.depth === 3);
  const baseDepth = headings.length
    ? Math.min(...headings.map((h) => h.depth))
    : 0;
  const items = hasChapterLevel
    ? headings.filter((h) => h.depth === 2 || h.depth === 3)
    : headings.filter((h) => h.depth <= baseDepth + 1);
  if (!items.length) return null;

  // 缩进以筛选后的最浅层级为基准
  const minDepth = Math.min(...items.map((h) => h.depth));

  return (
    <div className="glass-card-static squircle p-4">
      <p
    className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted"
  >
        目录
      </p>
      <nav className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto pr-1">
        {items.map((h) => {
          const isActive = activeId === h.id;
          const isSub = h.depth > minDepth;
          return (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: "smooth" });
                  history.replaceState(null, "", `#${h.id}`);
                }
              }}
              className="press block rounded leading-snug transition-colors hover:text-brand"
              style={{
                paddingLeft: isSub ? "14px" : "0",
                fontSize: isSub ? "12px" : "13px",
                color: isActive
                  ? "var(--color-brand)"
                  : isSub
                    ? "var(--color-tertiary)"
                    : "var(--color-secondary)",
                fontWeight: isActive ? 600 : isSub ? 400 : 500,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {h.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

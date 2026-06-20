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

    const els = document.querySelectorAll("article h1, article h2, article h3, article h4, article h5, article h6");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  // Show all headings, not just h2 and h3
  const items = headings;
  if (!items.length) return null;

  // Find shallowest depth so indentation starts from 0
  const minDepth = Math.min(...items.map((h) => h.depth));

  return (
    <div className="glass-card-static squircle p-4">
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-secondary)" }}
      >
        目录
      </p>
      <nav className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto pr-1">
        {items.map((h) => {
          const isActive = activeId === h.id;
          const level = h.depth - minDepth;
          // 设置最小字体大小为 12px，避免字体过小
          const fontSize = Math.max(12, 14 - level * 0.5);
          // 限制最大缩进，避免缩进过大
          const paddingLeft = Math.min(level * 10, 40);
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
              className="block rounded leading-relaxed transition-colors hover:text-[var(--color-brand)] py-0.5"
              style={{
                paddingLeft: `${paddingLeft}px`,
                fontSize: `${fontSize}px`,
                color: isActive ? "var(--color-brand)" : "var(--color-secondary)",
                fontWeight: isActive ? 600 : level > 0 ? 400 : 500,
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                borderLeft: level > 0 ? "2px solid rgba(53,191,171,0.15)" : "none",
                marginLeft: level > 0 ? "4px" : "0",
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

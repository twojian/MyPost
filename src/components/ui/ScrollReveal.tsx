"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 全局滚动入场观察器（lvyovo 风格）
 * - 监听 .reveal / .reveal-scale 元素，进入视口时加 .is-visible
 * - 自动接管文章正文 .prose-notion > *：标题/代码块用放大入场，其余用上移入场，
 *   并按父级顺序预置错峰延迟
 * - MutationObserver 监听 DOM 新增节点（如列表视图切换），对新行重新绑定观察器，
 *   避免客户端重渲染后内容停留在不可见状态
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let io: IntersectionObserver | null = null;

    const bind = () => {
      const targets = document.querySelectorAll<HTMLElement>(
        ".reveal, .reveal-scale, .prose-notion > *"
      );

      targets.forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        if (el.parentElement?.classList.contains("prose-notion")) {
          const idx = Array.from(el.parentElement.children).indexOf(el);
          el.style.transitionDelay = `${Math.min(idx, 6) * 60}ms`;
          if (/^(H[1-6]|PRE|TABLE)$/.test(el.tagName)) {
            el.classList.add("reveal-scale");
          } else {
            el.classList.add("reveal");
          }
        }
      });

      // 首屏可见元素直接标记为已展示，避免观察器时序导致内容不可见
      const visibleNow = Array.from(targets).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
      visibleNow.forEach((el) => el.classList.add("is-visible"));

      if (io) io.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              el.classList.add("is-visible");
              io?.unobserve(el);
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
      );
      targets.forEach((el) => {
        if (!el.classList.contains("is-visible")) io?.observe(el);
      });
    };

    bind();

    // 客户端重渲染（如列表日/周/月/年/分类切换）新增的节点需要重新接管
    const mo = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.addedNodes.length > 0)) bind();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io?.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import {
  House,
  ChevronsLeft,
  ChevronsRight,
  GitBranch,
  Mail,
} from "lucide-react";
import { getCategoryMeta } from "@/lib/category-meta";
import { getTagAccentColor } from "@/lib/tag-meta";
import { MAIN_NAV } from "@/lib/nav";
import { mailtoHref, siteConfig } from "@/lib/site-config";

interface TagCount {
  name: string;
  count: number;
}

interface SiteShellProps {
  children: React.ReactNode;
  postsCount: number;
  tags: TagCount[];
  categories: TagCount[];
}

// 会话内仅首次加载播放首屏淡入；之后的导航交给 View Transition
let firstLoad = true;

export default function SiteShell({ children, postsCount, tags, categories }: SiteShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!firstLoad) return;
    // 延后到下一帧再落状态：避免 effect 内同步 setState 造成级联渲染
    const id = requestAnimationFrame(() => {
      firstLoad = false;
      setFadeIn(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderRow = (
    href: string,
    label: string,
    icon: typeof House,
    count?: number,
    back?: boolean
  ) => {
    const Icon = icon;
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        transitionTypes={back ? ["nav-back"] : undefined}
        className={`press flex items-center rounded-xl text-sm transition-colors row-hover ${
          collapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
        } ${active ? "text-brand font-medium" : "text-muted hover:text-brand"}`}
        style={
          active
            ? { background: "color-mix(in srgb, var(--color-brand) 15%, transparent)" }
            : undefined
        }
      >
        <Icon size={16} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="line-clamp-1 flex-1">{label}</span>
            {count != null && (
              <span
                className={`text-xs tabular-nums ${active ? "text-brand" : "text-subtle"}`}
              >
                {count}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  // 分类行：图标色块 + 名称 + 计数胶囊，激活态用各自强调色派生底纹
  const renderCategoryRow = (c: TagCount) => {
    const meta = getCategoryMeta(c.name);
    const Icon = meta.icon;
    const href = `/categories/${c.name}`;
    const encodedHref = `/categories/${encodeURIComponent(c.name)}`;
    // usePathname 可能返回编码或解码后的中文路径，两种情况都要判为激活
    const active =
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      pathname === encodedHref ||
      pathname.startsWith(`${encodedHref}/`);

    return (
      <Link
        key={href}
        href={href}
        title={collapsed ? `${c.name} · ${c.count}` : undefined}
        aria-current={active ? "page" : undefined}
        data-active={active ? "true" : "false"}
        className={`cat-row press ${collapsed ? "cat-row-collapsed" : ""}`}
        style={{ "--cat": meta.color } as React.CSSProperties}
      >
        <span className="cat-icon">
          <Icon size={14} strokeWidth={2.1} />
        </span>
        {!collapsed && (
          <>
            <span className="line-clamp-1 flex-1">{c.name}</span>
            <span className="cat-count">{c.count}</span>
          </>
        )}
      </Link>
    );
  };

  // 标签行：Catppuccin 色点 + 名称 + 计数胶囊，颜色与正文/标签页保持一致
  const renderTagRow = (t: TagCount) => {
    const href = `/tags/${encodeURIComponent(t.name)}`;
    const accent = getTagAccentColor(t.name);
    const active = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        key={href}
        href={href}
        title={collapsed ? `${t.name} · ${t.count}` : undefined}
        aria-current={active ? "page" : undefined}
        data-active={active ? "true" : "false"}
        className={`cat-row press ${collapsed ? "cat-row-collapsed" : ""}`}
        style={{ "--cat": accent, "--tag-accent": accent } as React.CSSProperties}
      >
        <span className="tag-dot" />
        {!collapsed && (
          <>
            <span className="line-clamp-1 flex-1">{t.name}</span>
            <span className="cat-count">{t.count}</span>
          </>
        )}
      </Link>
    );
  };

  const sectionDivider = () =>
    collapsed ? (
      <div
        className="mx-3 my-2 border-t"
        style={{ borderColor: "var(--color-border)" }}
      />
    ) : null;

  const sectionHeader = (title: string, href?: string, total?: number) => {
    if (collapsed) return null;
    const inner = (
      <>
        <span>{title}</span>
        {total != null && (
          <span
            className="rounded-full px-1.5 py-px text-[10px] font-medium tabular-nums text-subtle"
            style={{
              background: "color-mix(in srgb, var(--color-primary) 6%, transparent)",
            }}
          >
            {total}
          </span>
        )}
      </>
    );
    const cls =
      "flex items-center justify-between gap-2 px-3 pb-1.5 pt-4 text-xs font-semibold uppercase tracking-widest transition-colors text-subtle";

    return href ? (
      <Link href={href} className={`${cls} hover:text-brand`}>
        {inner}
      </Link>
    ) : (
      <p className={cls}>{inner}</p>
    );
  };

  return (
    <div
      className={`relative z-10 mx-auto flex w-full items-start gap-6 px-4 py-8 transition-[max-width] ${
        isHome ? "max-w-6xl" : "max-w-[1400px]"
      }`}
    >
      {!isHome && (
        <aside
          className={`sticky top-24 hidden shrink-0 flex-col rounded-3xl border transition-all duration-300 lg:flex ${
            collapsed ? "w-14" : "w-64"
          }`}
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-border)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            height: "calc(100vh - 7rem)",
            maxHeight: "700px",
          }}
        >
          {/* 头部：logo / 收起开关 */}
          <div
            className="flex items-center border-b p-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            {collapsed ? (
              <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="mx-auto rounded-xl p-2 transition-colors row-hover text-muted"
        aria-label="展开侧边栏"
      >
                <ChevronsRight size={16} />
              </button>
            ) : (
              <>
                <span
         className="font-display pl-1 text-lg text-fg"
       >
                  {siteConfig.name}
                </span>
                <button
         type="button"
         onClick={() => setCollapsed(true)}
         className="ml-auto rounded-xl p-2 transition-colors row-hover text-muted"
         aria-label="收起侧边栏"
       >
                  <ChevronsLeft size={16} />
                </button>
              </>
            )}
          </div>

          {/* 导航分区 */}
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
            {sectionHeader("浏览")}
            <div className="flex flex-col gap-0.5">
              {MAIN_NAV.map((item) =>
                renderRow(
                  item.href,
                  item.label,
                  item.icon,
                  item.href === "/posts" ? postsCount : undefined,
                  item.href === "/"
                )
              )}
            </div>

            {sectionDivider()}

            {sectionHeader("分类", "/categories", categories.length)}
            <div className="flex flex-col gap-0.5">
              {categories.slice(0, 14).map(renderCategoryRow)}
            </div>

            {sectionDivider()}

            {sectionHeader("标签", "/tags", tags.length)}
            <div className="flex flex-col gap-0.5">
              {tags.slice(0, 8).map(renderTagRow)}
            </div>
          </div>

          {/* 底部：个人 */}
          <div
            className="border-t p-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            {collapsed ? (
              <Image
                src="/images/ayanami.jpg"
                alt={siteConfig.author}
                width={32}
                height={32}
                className="mx-auto rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/ayanami.jpg"
                  alt={siteConfig.author}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p
          className="text-sm font-medium text-fg"
        >
                    {siteConfig.author}
                  </p>
                  <p
          className="truncate text-xs text-subtle"
        >
                    {siteConfig.tagline}
                  </p>
                </div>
                <Link
         href={siteConfig.github}
         target="_blank"
         rel="noopener noreferrer"
         className="rounded-lg p-1.5 transition-colors row-hover text-muted"
         aria-label={siteConfig.githubLabel}
       >
                  <GitBranch size={14} />
                </Link>
                <Link
         href={mailtoHref}
         className="rounded-lg p-1.5 transition-colors row-hover text-muted"
         aria-label={siteConfig.emailLabel}
       >
                  <Mail size={14} />
                </Link>
              </div>
            )}
          </div>
        </aside>
      )}

      <main className={`min-w-0 flex-1 ${fadeIn ? "page-fade-in" : ""}`}>
        <ViewTransition
          enter={{ "nav-back": "ios-back", default: "ios-zoom" }}
          exit={{ "nav-back": "ios-back", default: "ios-zoom" }}
          default="none"
        >
          {children}
        </ViewTransition>
      </main>
    </div>
  );
}

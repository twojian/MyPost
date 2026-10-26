"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import {
  House,
  FileText,
  Search,
  Archive,
  Globe2,
  Share2,
  FolderOpen,
  Tag,
  ChevronsLeft,
  ChevronsRight,
  GitBranch,
  Mail,
} from "lucide-react";

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

const NAV_ITEMS = [
  { href: "/", label: "首页", icon: House },
  { href: "/posts", label: "所有文章", icon: FileText },
  { href: "/search", label: "搜索", icon: Search },
  { href: "/archives", label: "归档", icon: Archive },
  { href: "/bloggers", label: "博客圈", icon: Globe2 },
  { href: "/share", label: "分享", icon: Share2 },
];

// 会话内仅首次加载播放首屏淡入；之后的导航交给 View Transition
let firstLoad = true;

export default function SiteShell({ children, postsCount, tags, categories }: SiteShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (firstLoad) setFadeIn(true);
    firstLoad = false;
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
        className={`press flex items-center rounded-xl text-sm transition-colors hover:bg-white/40 ${
          collapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
        } ${
          active
            ? ""
            : "text-[var(--color-secondary)] hover:text-[var(--color-brand)]"
        }`}
        style={
          active
            ? {
                background: "color-mix(in srgb, var(--color-brand) 15%, transparent)",
                color: "var(--color-brand)",
                fontWeight: 500,
              }
            : { fontWeight: 400 }
        }
      >
        <Icon size={16} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="line-clamp-1 flex-1">{label}</span>
            {count != null && (
              <span
                className="text-xs tabular-nums"
                style={{
                  color: active ? "var(--color-brand)" : "var(--color-tertiary)",
                }}
              >
                {count}
              </span>
            )}
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

  const sectionHeader = (title: string, href?: string) =>
    !collapsed ? (
      href ? (
        <Link
          href={href}
          className="block px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-[var(--color-brand)]"
          style={{ color: "var(--color-tertiary)" }}
        >
          {title}
        </Link>
      ) : (
        <p
          className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-tertiary)" }}
        >
          {title}
        </p>
      )
    ) : null;

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
                className="mx-auto rounded-xl p-2 transition-colors hover:bg-white/40"
                style={{ color: "var(--color-secondary)" }}
                aria-label="展开侧边栏"
              >
                <ChevronsRight size={16} />
              </button>
            ) : (
              <>
                <span
                  className="font-display pl-1 text-lg"
                  style={{ color: "var(--color-primary)" }}
                >
                  Twojian
                </span>
                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  className="ml-auto rounded-xl p-2 transition-colors hover:bg-white/40"
                  style={{ color: "var(--color-secondary)" }}
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
              {NAV_ITEMS.map((item) =>
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

            {sectionHeader("分类", "/categories")}
            <div className="flex flex-col gap-0.5">
              {categories.slice(0, 6).map((c) =>
                renderRow(`/categories/${c.name}`, c.name, FolderOpen, c.count)
              )}
            </div>

            {sectionDivider()}

            {sectionHeader("标签", "/tags")}
            <div className="flex flex-col gap-0.5">
              {tags.slice(0, 8).map((t) =>
                renderRow(`/tags/${t.name}`, t.name, Tag, t.count)
              )}
            </div>
          </div>

          {/* 底部：个人 */}
          <div
            className="border-t p-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            {collapsed ? (
              <Image
                src="/images/avatar.png"
                alt="Twojian"
                width={32}
                height={32}
                className="mx-auto rounded-full"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/avatar.png"
                  alt="Twojian"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Twojian
                  </p>
                  <p
                    className="truncate text-xs"
                    style={{ color: "var(--color-tertiary)" }}
                  >
                    记录可复用的知识
                  </p>
                </div>
                <Link
                  href="https://github.com/twojian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 transition-colors hover:bg-white/40"
                  style={{ color: "var(--color-secondary)" }}
                  aria-label="GitHub"
                >
                  <GitBranch size={14} />
                </Link>
                <Link
                  href="mailto:twojian0705@163.com"
                  className="rounded-lg p-1.5 transition-colors hover:bg-white/40"
                  style={{ color: "var(--color-secondary)" }}
                  aria-label="Email"
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

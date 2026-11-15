/**
 * 导航配置单一来源。
 *
 * 顶部导航（Navbar）、侧边栏导航（SiteShell）与首页快捷入口（Bento）
 * 共用这一份数据，新增/调整入口时只改这里，避免三处各写一套。
 */

import { Archive, FileText, Globe, Hash, House, Search, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** 顶部导航里仅以图标呈现（文字在侧边栏 / 移动端抽屉中展示） */
  iconOnly?: boolean;
}

/** 全站主导航 */
export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "首页", icon: House },
  { href: "/posts", label: "所有文章", icon: FileText },
  { href: "/search", label: "搜索", icon: Search, iconOnly: true },
  { href: "/archives", label: "归档", icon: Archive },
  { href: "/bloggers", label: "博客圈", icon: Globe },
  { href: "/share", label: "分享", icon: Share2 },
];

/** 首页 Bento 区的内容快捷键（指向站内聚合页） */
export const HOME_SHORTCUTS: NavItem[] = [
  { href: "/posts", label: "近期文章", icon: FileText },
  { href: "/tags", label: "标签", icon: Hash },
  { href: "/categories", label: "分类", icon: Globe },
  { href: "/archives", label: "归档", icon: Archive },
];

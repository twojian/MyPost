import type { Metadata } from "next";
import ShareClient from "./ShareClient";
import { SHARE_ITEMS, type ShareItem } from "@/lib/share";
import { fetchRuanYifengWeekly } from "@/lib/fetch-share";

/** ISR：每小时自动重新生成 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "分享",
  description: "按知识大类整理的优质技术文章与专栏，来自杜子源、二丫讲梵、阮一峰及博客圈的朋友们。",
};

export default async function SharePage() {
  const dynamicRuan = await fetchRuanYifengWeekly(5);

  // 去重：动态里已有的 URL，从静态精选里剔除，避免重复显示
  const dynamicUrls = new Set(dynamicRuan.map((d) => d.url));
  const staticDedup: ShareItem[] = SHARE_ITEMS.filter((s) => !dynamicUrls.has(s.url));

  // 合并：动态周刊置顶 + 去重后的静态精选跟上
  // 排序让同一个 category 的条目自然聚集，动态的在最前
  const merged: ShareItem[] = [...dynamicRuan, ...staticDedup];

  return <ShareClient items={merged} />;
}

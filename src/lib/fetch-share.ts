/**
 * 动态抓取分享专栏的外部源（RSS / Atom feed）。
 * 极简正则解析，不引入额外 XML 依赖。失败时返回空数组。
 */

import type { ShareItem } from "./share";

/** 阮一峰科技爱好者周刊 Atom feed */
const RUANYIFENG_ATOM = "https://www.ruanyifeng.com/blog/atom.xml";

/**
 * 从 Atom feed 里按顺序截取前 N 个 <entry> 块。
 * 不做完整 XML 解析——结构固定时，正则更轻量。
 */
function parseAtomEntries(xml: string, limit: number): string[] {
  const blocks: string[] = [];
  let i = 0;
  const entryRe = /<entry[\s\S]*?<\/entry>/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(xml)) !== null && i < limit) {
    blocks.push(m[0]);
    i++;
  }
  return blocks;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function extract(entry: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = entry.match(re);
  return m ? stripTags(m[1]) : "";
}

function extractLink(entry: string): string {
  const re = /<link\s[^>]*href="([^"]+)"[^>]*rel="alternate"[^>]*>/;
  const m = entry.match(re);
  if (m) return m[1];
  // 有些 feed 把 rel 放在 href 后面
  const re2 = /<link\s[^>]*rel="alternate"[^>]*href="([^"]+)"[^>]*>/;
  const m2 = entry.match(re2);
  return m2 ? m2[1] : "";
}

/**
 * 抓取阮一峰科技爱好者周刊最新 N 条。
 * 失败时返回 [] —— 不阻塞静态精选。
 */
export async function fetchRuanYifengWeekly(limit = 5): Promise<ShareItem[]> {
  try {
    const res = await fetch(RUANYIFENG_ATOM, {
      // Next.js server fetch 默认 cache: "force-cache"，
      // 但我们在 page.tsx 里用 revalidate = 3600 控制，
      // 这里设 cache: "no-store" 让 ISR 自己管缓存周期
      cache: "no-store",
      headers: { Accept: "application/atom+xml, application/xml, */*" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const entries = parseAtomEntries(xml, limit);
    const out: ShareItem[] = [];

    for (const entry of entries) {
      const title = extract(entry, "title");
      const url = extractLink(entry);
      const summary = extract(entry, "summary");
      const published = extract(entry, "published");

      if (!title || !url) continue;

      // 阮一峰的分类 tag 里有 Weekly，但也有非周刊的文章（比如 anthropic.html）。
      // 我们只想要周刊。如果标题不含"周刊"，跳过。
      if (!title.includes("周刊")) continue;

      out.push({
        title,
        url,
        author: "阮一峰",
        authorUrl: "https://www.ruanyifeng.com",
        category: "技术周刊 / 观点",
        type: "文章",
        desc: summary ? (summary.length > 80 ? summary.slice(0, 80) + "…" : summary) : undefined,
        // @ts-expect-error — published 不是 ShareItem 标准字段，但传给 client 无妨
        published,
      });
    }

    return out;
  } catch {
    return [];
  }
}

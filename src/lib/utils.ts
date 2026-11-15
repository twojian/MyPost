import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

/**
 * 归一化 frontmatter 里的日期为 `YYYY-MM-DD`。
 *
 * posts.ts 等处的日期解析统一走这里，禁止各写一份 toISOString().split("T")。
 * 缺失或非法日期回退到 1970-01-01，保证后续 formatDate / 排序不产生 NaN。
 */
export function normalizeDate(value: unknown): string {
  if (value === null || value === undefined || value === "") return "1970-01-01";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "1970-01-01";
  return date.toISOString().slice(0, 10);
}

/** 展示用中文日期；入参须为 normalizeDate 产出的 ISO 日期 */
export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "yyyy 年 M 月 d 日", { locale: zhCN });
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

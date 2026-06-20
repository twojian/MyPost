import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "yyyy 年 M 月 d 日", { locale: zhCN });
  } catch (error) {
    // 如果日期无效，返回空字符串或默认值
    return dateStr || '';
  }
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

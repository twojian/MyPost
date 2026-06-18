import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "yyyy 年 M 月 d 日", { locale: zhCN });
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

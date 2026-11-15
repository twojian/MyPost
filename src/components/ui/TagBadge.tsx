import Link from "next/link";
import { getCategoryMeta } from "@/lib/category-meta";
import { getTagAccentColor } from "@/lib/tag-meta";

interface Props {
  name: string;
  variant?: "tag" | "category";
  showLink?: boolean;
  /** 可选计数胶囊（标签云 / 标签页用） */
  count?: number;
  /** sm：正文内联徽章；lg：标签页胶囊 */
  size?: "sm" | "lg";
}

export default function TagBadge({
  name,
  variant = "tag",
  showLink = true,
  count,
  size = "sm",
}: Props) {
  const isCategory = variant === "category";
  const href = isCategory
    ? `/categories/${encodeURIComponent(name)}`
    : `/tags/${encodeURIComponent(name)}`;
  // 标签颜色由 Catppuccin 色板（tag-meta）统一决定；分类沿用 category-meta 的强调色
  const accent = isCategory ? getCategoryMeta(name).color : getTagAccentColor(name);

  const badge = (
    <span
      className={`tag-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        isCategory ? "tag-badge-category" : "tag-badge-tag"
      } ${size === "lg" ? "tag-badge-lg" : ""}`}
      style={{ "--tag-accent": accent } as React.CSSProperties}
    >
      {isCategory ? name : `# ${name}`}
      {count != null && <span className="tag-badge-count">{count}</span>}
    </span>
  );

  if (!showLink) return badge;

  return <Link href={href}>{badge}</Link>;
}

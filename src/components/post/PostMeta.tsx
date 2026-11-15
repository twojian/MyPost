import { formatDate } from "@/lib/utils";
import TagBadge from "@/components/ui/TagBadge";

interface Props {
  date: string;
  readingTime?: string;
  wordCount?: number;
  tags?: string[];
  categories?: string[];
  /** 字号：md 用于文章头部，sm 用于列表卡片 */
  size?: "sm" | "md";
  /** 标签是否渲染为可点击链接；卡片整体已被 Link 包裹时须传 false，避免嵌套 <a> */
  tagLinks?: boolean;
}

/**
 * 文章元信息（日期 · 阅读时长 · 字数 + 标签/分类）。
 *
 * 列表卡片与文章头部共用此组件，禁止各自再写一份元信息渲染逻辑。
 */
export default function PostMeta({
  date,
  readingTime,
  wordCount,
  tags,
  categories,
  size = "md",
  tagLinks = true,
}: Props) {
  const textClass = size === "sm" ? "text-xs" : "text-sm";
  const hasTags = (tags && tags.length > 0) || (categories && categories.length > 0);

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex flex-wrap items-center gap-3 text-muted ${textClass}`}>
        <time dateTime={date}>{formatDate(date)}</time>
        {readingTime && (
          <>
            <span aria-hidden="true">·</span>
            <span>{readingTime}</span>
          </>
        )}
        {wordCount !== undefined && (
          <>
            <span aria-hidden="true">·</span>
            <span>{wordCount} 字</span>
          </>
        )}
      </div>

      {hasTags && (
        <div className="flex flex-wrap gap-2">
          {categories?.map((cat) => (
            <TagBadge
              key={cat}
              name={cat}
              variant="category"
              showLink={tagLinks}
            />
          ))}
          {tags?.map((tag) => (
            <TagBadge key={tag} name={tag} showLink={tagLinks} />
          ))}
        </div>
      )}
    </div>
  );
}

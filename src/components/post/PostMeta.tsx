import { formatDate } from "@/lib/utils";
import TagBadge from "@/components/ui/TagBadge";

interface Props {
  date: string;
  readingTime?: string;
  wordCount?: number;
  tags?: string[];
  categories?: string[];
}

export default function PostMeta({ date, readingTime, wordCount, tags, categories }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center gap-3 text-sm"
        style={{ color: "var(--color-secondary)" }}
      >
        <time>{formatDate(date)}</time>
        {readingTime && (
          <>
            <span>·</span>
            <span>{readingTime}</span>
          </>
        )}
        {wordCount !== undefined && (
          <>
            <span>·</span>
            <span>{wordCount} 字</span>
          </>
        )}
      </div>

      {((tags && tags.length > 0) || (categories && categories.length > 0)) && (
        <div className="flex flex-wrap gap-2">
          {categories?.map((cat) => (
            <TagBadge key={cat} name={cat} variant="category" />
          ))}
          {tags?.map((tag) => (
            <TagBadge key={tag} name={tag} />
          ))}
        </div>
      )}
    </div>
  );
}

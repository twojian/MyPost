import type { Metadata } from "next";
import TagBadge from "@/components/ui/TagBadge";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = { title: "标签" };

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-fg">
        标签
      </h1>
      <div className="glass-card-static flex flex-wrap gap-3 p-6">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <TagBadge key={tag.name} name={tag.name} count={tag.count} size="lg" />
          ))
        ) : (
          <p className="text-muted">暂无标签</p>
        )}
      </div>
    </>
  );
}

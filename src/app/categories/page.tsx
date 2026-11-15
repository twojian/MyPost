import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllCategories } from "@/lib/posts";
import { getCategoryMeta } from "@/lib/category-meta";

export const metadata: Metadata = { title: "分类" };

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-fg">
        分类
      </h1>
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((cat) => {
            const { icon: Icon, color } = getCategoryMeta(cat.name);
            return (
              <Link
                key={cat.name}
                href={`/categories/${cat.name}`}
                className="glass-card press group flex items-center gap-3 rounded-2xl p-4"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                  style={{
                    color,
                    background: `color-mix(in srgb, ${color} 15%, transparent)`,
                  }}
                >
                  <Icon size={18} strokeWidth={2.1} />
                </span>
                <div className="min-w-0 flex-1">
                  <p
          className="truncate text-sm font-medium text-fg"
        >
                    {cat.name}
                  </p>
                  <p className="text-xs text-subtle">
                    {cat.count} 篇文章
                  </p>
                </div>
                <ChevronRight
         size={16}
         className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 text-subtle"
        />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="glass-card-static p-6">
          <p className="text-muted">暂无分类</p>
        </div>
      )}
    </>
  );
}

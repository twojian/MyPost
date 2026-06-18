import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/posts";

export const metadata: Metadata = { title: "分类" };

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        分类
      </h1>
      <div className="glass-card-static flex flex-wrap gap-3 p-6">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories/${cat.name}`}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-transform hover:scale-105"
              style={{
                background: "rgba(31, 201, 231, 0.15)",
                color: "var(--color-brand-secondary)",
              }}
            >
              {cat.name}
              <span
                className="rounded-full px-1.5 py-0.5 text-xs"
                style={{ background: "rgba(31, 201, 231, 0.2)" }}
              >
                {cat.count}
              </span>
            </Link>
          ))
        ) : (
          <p style={{ color: "var(--color-secondary)" }}>暂无分类</p>
        )}
      </div>
    </>
  );
}

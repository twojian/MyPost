"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PostGroup } from "@/lib/posts";
import StudyNoteList from "@/components/notes/StudyNoteList";

export default function PostGroupList({ groups }: { groups: PostGroup[] }) {
  // First group open by default; others closed.
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g, i) => [g.key, i === 0]))
  );

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col gap-3">
      {groups.map((g) => {
        const isOpen = !!open[g.key];
        return (
          <div
            key={g.key}
            className="glass-card-static squircle overflow-hidden"
            style={{ borderRadius: "32px" }}
          >
            {/* Group header — clickable */}
            <button
              type="button"
              onClick={() => toggle(g.key)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/30"
              aria-expanded={isOpen}
            >
              <ChevronRight
                size={18}
                style={{
                  color: "var(--color-brand)",
                  transition: "transform 0.2s ease",
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
              {g.icon && <span className="text-xl leading-none">{g.icon}</span>}
              <div className="min-w-0 flex-1">
                <p
                  className="text-base font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {g.title}
                </p>
                {g.description && (
                  <p
                    className="mt-0.5 line-clamp-1 text-xs"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    {g.description}
                  </p>
                )}
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  background: "rgba(53,191,171,0.15)",
                  color: "var(--color-brand)",
                }}
              >
                {g.posts.length}
              </span>
            </button>

            {/* Children */}
            {isOpen && (
              <div
                className="border-t"
                style={{ borderColor: "rgba(53,191,171,0.15)" }}
              >
                {/* For blog group, use StudyNoteList to display by subject */}
                {g.key === "blog" ? (
                  <div className="px-3 py-2">
                    <StudyNoteList posts={g.posts} />
                  </div>
                ) : (
                  <ul className="flex flex-col gap-1 px-3 py-2">
                    {g.posts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 transition-colors hover:bg-white/40"
                        >
                          <span
                            className="line-clamp-1 text-sm"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {post.title}
                          </span>
                          <span
                            className="shrink-0 text-xs"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {formatDate(post.date)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PostMeta } from "@/lib/posts";

interface SubjectGroup {
  subject: string;
  chapters: ChapterGroup[];
}

interface ChapterGroup {
  chapter: string;
  posts: PostMeta[];
}

export default function StudyNoteList({ posts }: { posts: PostMeta[] }) {
  const subjectOrder = ["数据结构", "操作系统", "计算机网络", "计组"];
  
  const [subjectOpen, setSubjectOpen] = useState<Record<string, boolean>>({
    "数据结构": true,
    "操作系统": true,
    "计算机网络": true,
    "计组": true
  });
  const [chapterOpen, setChapterOpen] = useState<Record<string, boolean>>({});

  function toggleSubject(subject: string) {
    setSubjectOpen((prev) => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  }

  function toggleChapter(chapterKey: string) {
    setChapterOpen((prev) => ({
      ...prev,
      [chapterKey]: !prev[chapterKey]
    }));
  }

  const subjectMap = new Map<string, Map<string, PostMeta[]>>();

  for (const post of posts) {
    const segs = post.slug.split("/");
    let subject = "其他";
    let chapter = "";

    if (segs.includes("blog")) {
      if (segs.includes("数据结构笔记")) {
        subject = "数据结构";
        const idx = segs.indexOf("数据结构笔记");
        chapter = segs[idx + 1] || "";
        // 如果chapter也是"数据结构笔记"，取下一个
        if (chapter === "数据结构笔记") {
          chapter = segs[idx + 2] || "";
        }
      } else if (segs.includes("操作系统笔记")) {
        subject = "操作系统";
        const idx = segs.indexOf("操作系统笔记");
        chapter = segs[idx + 1] || "";
        // 如果chapter也是"操作系统笔记"，取下一个
        if (chapter === "操作系统笔记") {
          chapter = segs[idx + 2] || "";
        }
      } else if (segs.includes("计算机网络笔记")) {
        subject = "计算机网络";
        const idx = segs.indexOf("计算机网络笔记");
        chapter = segs[idx + 1] || "";
        // 如果chapter也是"计算机网络笔记"，取下一个
        if (chapter === "计算机网络笔记") {
          chapter = segs[idx + 2] || "";
        }
      } else if (segs.includes("计算机网络")) {
        subject = "计算机网络";
        const idx = segs.indexOf("计算机网络");
        chapter = segs[idx + 1] || "";
        // 如果chapter也是"计算机网络"，取下一个
        if (chapter === "计算机网络") {
          chapter = segs[idx + 2] || "";
        }
      } else if (segs.includes("代码小抄")) {
        subject = "数据结构";
        chapter = "代码小抄";
        const idx = segs.indexOf("代码小抄");
        // 如果有更下一级，使用更下一级
        if (segs[idx + 1] === "代码小抄") {
          chapter = segs[idx + 2] || "代码小抄";
        }
      } else if (segs.includes("408二级结论")) {
        subject = "其他";
        chapter = "408二级结论";
      } else if (segs.includes("真题大题")) {
        subject = "其他";
        chapter = "真题大题";
        const idx = segs.indexOf("真题大题");
        // 如果有更下一级，使用更下一级
        if (segs[idx + 1] === "真题大题") {
          chapter = segs[idx + 2] || "真题大题";
        }
      }
    }

    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, new Map());
    }
    const chapterMap = subjectMap.get(subject)!;
    if (!chapterMap.has(chapter)) {
      chapterMap.set(chapter, []);
    }
    chapterMap.get(chapter)!.push(post);
  }

  const subjects: SubjectGroup[] = [];
  for (const subjectName of subjectOrder) {
    if (subjectMap.has(subjectName)) {
      const chapterMap = subjectMap.get(subjectName)!;
      const chapters: ChapterGroup[] = Array.from(chapterMap.entries())
        .map(([chapter, chapterPosts]) => ({
          chapter,
          posts: chapterPosts.sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"))
        }))
        .sort((a, b) => a.chapter.localeCompare(b.chapter, "zh-Hans-CN"));
      subjects.push({ subject: subjectName, chapters });
    }
  }

  for (const [subjectName, chapterMap] of subjectMap.entries()) {
    if (!subjectOrder.includes(subjectName)) {
      const chapters: ChapterGroup[] = Array.from(chapterMap.entries())
        .map(([chapter, chapterPosts]) => ({
          chapter,
          posts: chapterPosts.sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"))
        }))
        .sort((a, b) => a.chapter.localeCompare(b.chapter, "zh-Hans-CN"));
      subjects.push({ subject: subjectName, chapters });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {subjects.map(({ subject, chapters }) => {
        const isSubjectOpen = !!subjectOpen[subject];
        return (
          <div
            key={subject}
            className="glass-card-static squircle overflow-hidden"
            style={{ borderRadius: "32px" }}
          >
            <button
              type="button"
              onClick={() => toggleSubject(subject)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/30"
            >
              <ChevronRight
                size={20}
                style={{
                  color: "var(--color-brand)",
                  transition: "transform 0.2s ease",
                  transform: isSubjectOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
              <div className="min-w-0 flex-1">
                <p
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {subject}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  background: "rgba(53,191,171,0.15)",
                  color: "var(--color-brand)",
                }}
              >
                {chapters.reduce((sum, c) => sum + c.posts.length, 0)}
              </span>
            </button>

            {isSubjectOpen && (
              <div
                className="border-t"
                style={{ borderColor: "rgba(53,191,171,0.15)" }}
              >
                {chapters.map(({ chapter, posts: chapterPosts }) => {
                  const chapterKey = `${subject}-${chapter}`;
                  const isChapterOpen = chapterOpen[chapterKey] ?? chapters.length <= 1;
                  const displayTitle = chapter || "全部笔记";
                  
                  return (
                    <div key={chapterKey}>
                      {chapters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => toggleChapter(chapterKey)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-white/20"
                        >
                          <ChevronRight
                            size={16}
                            style={{
                              color: "var(--color-secondary)",
                              transition: "transform 0.2s ease",
                              transform: isChapterOpen ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                          />
                          <span style={{ color: "var(--color-primary)" }}>
                            {displayTitle}
                          </span>
                          <span
                            className="ml-auto text-xs"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            {chapterPosts.length}
                          </span>
                        </button>
                      )}
                      
                      {(chapters.length === 1 || isChapterOpen) && (
                        <ul className="flex flex-col gap-1 px-3 pb-2">
                          {chapterPosts.map((post) => (
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
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

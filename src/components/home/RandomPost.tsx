"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function RandomPost({ posts }: { posts: PostMeta[] }) {
  const [post, setPost] = useState<PostMeta | null>(null);

  useEffect(() => {
    if (!posts.length) return;
    // 随机文章依赖客户端状态，延后到下一帧再落状态，避免 effect 内同步 setState
    const id = requestAnimationFrame(() =>
      setPost(posts[Math.floor(Math.random() * posts.length)])
    );
    return () => cancelAnimationFrame(id);
  }, [posts]);

  if (!post) {
    return (
      <div
        className="glass-card-static squircle h-24 animate-pulse"
        aria-hidden
      />
    );
  }

  return (
    <Link href={`/posts/${post.slug}`} className="block h-full w-full">
      <div className="flex h-full w-full flex-col justify-center px-5 py-2">
        <p
     className="mb-0.5 text-[10px] font-medium leading-tight text-muted"
   >
          随机推荐
        </p>
        <p
     className="line-clamp-1 text-sm font-semibold leading-snug text-fg"
   >
          {post.title}
        </p>
        <p
     className="mt-0.5 text-[10px] leading-tight text-muted"
   >
          {formatDate(post.date)}
        </p>
      </div>
    </Link>
  );
}

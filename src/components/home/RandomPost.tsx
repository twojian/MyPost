"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function RandomPost({ posts }: { posts: PostMeta[] }) {
  const [post, setPost] = useState<PostMeta | null>(null);

  useEffect(() => {
    if (posts.length) {
      setPost(posts[Math.floor(Math.random() * posts.length)]);
    }
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
          className="mb-0.5 text-[10px] font-medium leading-tight"
          style={{ color: "var(--color-secondary)" }}
        >
          随机推荐
        </p>
        <p
          className="line-clamp-1 text-sm font-semibold leading-snug"
          style={{ color: "var(--color-primary)" }}
        >
          {post.title}
        </p>
        <p
          className="mt-0.5 text-[10px] leading-tight"
          style={{ color: "var(--color-secondary)" }}
        >
          {formatDate(post.date)}
        </p>
      </div>
    </Link>
  );
}

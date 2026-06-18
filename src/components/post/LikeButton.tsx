"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ slug }: { slug: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const isLiked = localStorage.getItem(`liked:${slug}`) === "1";
    const saved = parseInt(localStorage.getItem(`likeCount:${slug}`) ?? "0", 10);
    setLiked(isLiked);
    setCount(saved);
  }, [slug]);

  const toggle = () => {
    const next = !liked;
    const nextCount = Math.max(0, count + (next ? 1 : -1));
    setLiked(next);
    setCount(nextCount);
    localStorage.setItem(`liked:${slug}`, next ? "1" : "0");
    localStorage.setItem(`likeCount:${slug}`, String(nextCount));
  };

  return (
    <button
      onClick={toggle}
      className="glass-card-static squircle flex w-full flex-col items-center gap-1 py-4 transition-transform hover:scale-[1.03] active:scale-95"
      aria-label={liked ? "取消点赞" : "点赞"}
    >
      <Heart
        size={26}
        fill={liked ? "#e0405e" : "none"}
        strokeWidth={1.8}
        style={{ color: liked ? "#e0405e" : "var(--color-secondary)", transition: "all 0.2s" }}
      />
      {count > 0 && (
        <span className="text-xs" style={{ color: "var(--color-secondary)" }}>
          {count}
        </span>
      )}
    </button>
  );
}

"use client";

import { useMemo, useState } from "react";

interface SiteIconProps {
  /** 站点地址，任意页面 URL 均可，自动取 hostname */
  url: string;
  /** 站点名称，用于首字母兜底与 alt */
  name?: string;
  /** 外框尺寸（px） */
  size?: number;
  /** 圆角：full 为圆形，其余按 px */
  radius?: number | "full";
  /** 兜底字母底色 */
  color?: string;
  className?: string;
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function initialOf(name: string | undefined, host: string | null): string {
  const source = (name ?? host ?? "").trim();
  if (!source) return "?";
  const first = source.charAt(0);
  return /[a-z]/i.test(first) ? first.toUpperCase() : first;
}

/**
 * 站点图标：请求 /api/favicon 自动匹配目标站点 favicon，加载失败回落首字母。
 */
export default function SiteIcon({
  url,
  name,
  size = 24,
  radius = "full",
  color,
  className = "",
}: SiteIconProps) {
  const host = useMemo(() => hostOf(url), [url]);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const letter = initialOf(name, host);
  const borderRadius = radius === "full" ? "9999px" : `${radius}px`;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius,
        background: color ?? "var(--color-brand)",
        color: "var(--color-on-brand)",
        lineHeight: 1,
      }}
    >
      {!loaded && (
        <span
          className="select-none font-display font-bold"
          style={{ fontSize: Math.max(8, Math.round(size * 0.44)) }}
          aria-hidden
        >
          {letter}
        </span>
      )}
      {host && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/favicon?url=${encodeURIComponent(host)}`}
          alt={name ? `${name} 站点图标` : ""}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200"
          style={{
            padding: Math.max(2, Math.round(size * 0.16)),
            background: "var(--color-bg-secondary)",
            opacity: loaded ? 1 : 0,
          }}
        />
      )}
    </span>
  );
}

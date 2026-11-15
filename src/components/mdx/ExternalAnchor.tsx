"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { useSyncExternalStore } from "react";
import SiteIcon from "@/components/ui/SiteIcon";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** 当前域名无需订阅变化，挂载后读取一次即可；服务端快照为 null，保证首帧渲染一致 */
const subscribeNoop = () => () => {};
const getHostSnapshot = () => window.location.host;
const getHostServerSnapshot = () => null;

/**
 * 站点正式域名（构建期常量）。
 *
 * 有了它，SSR 阶段也能把 `https://twojian.cloud/xxx` 这类同域绝对地址判为内链，
 * 不必等客户端拿到 location.host 再纠正，避免首帧闪现外链图标。
 */
const SITE_HOST = (() => {
  try {
    return new URL(siteConfig.url).host.toLowerCase();
  } catch {
    return "";
  }
})();

/** 域名是否属于本站：构建期域名 + 运行时实际域名 */
function isSameSiteHost(candidate: string, runtimeHost: string | null): boolean {
  const host = candidate.toLowerCase();
  if (!host) return false;
  return host === SITE_HOST || (runtimeHost !== null && host === runtimeHost.toLowerCase());
}

/** 带显式协议前缀（http:、mailto:、tel: 等） */
const PROTOCOL_RE = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

/**
 * 站内链接判定。
 *
 * host 为空表示服务端渲染或尚未挂载，此阶段只认可与域名无关的形态，
 * 保证 SSR 与客户端首帧一致（同域绝对地址则在挂载后再纠正为内链）。
 */
function isInternalHref(href: string, host: string | null): boolean {
  if (!href) return false;
  // 页内锚点
  if (href.startsWith("#")) return true;
  // 站内绝对路径；"//" 开头是协议相对地址，属站外
  if (href.startsWith("/")) return !href.startsWith("//");
  // ./ 与 ../ 相对路径
  if (/^\.{1,2}\//.test(href)) return true;
  // 协议相对地址 //example.com/x：与本站域名比对
  if (href.startsWith("//")) {
    return isSameSiteHost(href.slice(2).split(/[/?#]/)[0], host);
  }
  // 形如 posts/how-to-read 的裸相对路径
  if (!PROTOCOL_RE.test(href)) return true;
  // mailto: / tel: 等非 http 协议按站外链接处理
  if (!/^https?:/i.test(href)) return false;
  // 同域绝对地址（如 https://twojian.cloud/posts/...）判为内链；
  // 域名来自构建期常量，SSR 与客户端结论一致。
  try {
    return isSameSiteHost(new URL(href).host, host);
  } catch {
    return false;
  }
}

/**
 * 正文链接分发：
 * - 站内链接（锚点 / 站内路径 / 同域地址）→ next/link 客户端跳转，不开新窗口，加内链标识；
 * - 站外 http(s) 链接 → 新窗口打开并前缀站点图标，行为保持不变；
 * - mailto: / tel: 等 → 原生 a，不加图标。
 */
export default function ExternalAnchor({
  href,
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const host = useSyncExternalStore<string | null>(
    subscribeNoop,
    getHostSnapshot,
    getHostServerSnapshot,
  );

  const url = href ?? "";

  if (isInternalHref(url, host)) {
    const internalClass = cn("mdx-internal-link", className);

    // 页内锚点交给浏览器原生处理，其余走 next/link 的客户端路由
    if (url.startsWith("#")) {
      return (
        <a href={url} className={internalClass} {...props}>
          {children}
        </a>
      );
    }

    return (
      <Link href={url} className={internalClass} {...props}>
        {children}
      </Link>
    );
  }

  if (!/^https?:/i.test(url)) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      <SiteIcon url={url} size={14} radius={3} className="mr-1 align-[-2px]" />
      {children}
    </a>
  );
}

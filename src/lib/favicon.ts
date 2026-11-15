import { getFavicon } from "grab-favicon";

/**
 * 站点图标（favicon）自动匹配。
 *
 * 抓取链路：
 *   1. grab-favicon：解析页面 <link rel="icon"> / apple-touch-icon / manifest，
 *      优先矢量图标，再按声明尺寸取最大的一张；
 *   2. 镜像兜底：DuckDuckGo / favicon.im，兜住拒绝爬虫或纯 JS 渲染的站点；
 *   3. 全部失败由前端渲染首字母占位，不会出现破图。
 */

export interface ResolvedIcon {
  data: Uint8Array<ArrayBuffer>;
  mimeType: string;
}

const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 300;

const store = new Map<string, { icon: ResolvedIcon; expiresAt: number }>();

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/** 仅接受公网域名，拒绝 IP、内网与单标签主机，避免 SSRF。 */
const HOST_PATTERN =
  /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;
const BLOCKED_HOST =
  /^(localhost|.*\.local|.*\.internal|.*\.localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/;

export function normalizeHostname(input: string): string | null {
  const raw = input.trim();
  if (!raw || raw.length > 2048) return null;

  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const host = parsed.hostname.toLowerCase();
  if (!HOST_PATTERN.test(host) || BLOCKED_HOST.test(host)) return null;

  return host;
}

async function fromSite(host: string): Promise<ResolvedIcon | null> {
  for (const target of [`https://${host}`, `http://${host}`]) {
    try {
      const result = await getFavicon(target, {
        grabImage: true,
        timeoutMs: 7000,
        userAgent: USER_AGENT,
        googleFallbackSize: 64,
      });
      const data = result.image?.data;
      if (data && data.length > 0) {
        return {
          data: new Uint8Array(data),
          mimeType: result.image?.mimeType || "image/png",
        };
      }
    } catch {
      // 换下一个协议 / 下一个来源
    }
  }
  return null;
}

async function fromMirror(host: string): Promise<ResolvedIcon | null> {
  const mirrors = [
    `https://icons.duckduckgo.com/ip3/${host}.ico`,
    `https://favicon.im/${host}?larger=true`,
  ];

  for (const url of mirrors) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(6000),
        headers: { "User-Agent": USER_AGENT },
      });
      const contentType = res.headers.get("content-type") ?? "";
      if (!res.ok || !contentType.startsWith("image/")) continue;

      const buffer = new Uint8Array(await res.arrayBuffer());
      if (buffer.byteLength === 0) continue;

      return { data: buffer, mimeType: contentType.split(";")[0].trim() };
    } catch {
      // 继续尝试下一个镜像
    }
  }
  return null;
}

export async function resolveFavicon(host: string): Promise<ResolvedIcon | null> {
  const cached = store.get(host);
  if (cached && cached.expiresAt > Date.now()) return cached.icon;

  const icon = (await fromSite(host)) ?? (await fromMirror(host));
  if (!icon) return null;

  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(host, { icon, expiresAt: Date.now() + TTL_MS });

  return icon;
}

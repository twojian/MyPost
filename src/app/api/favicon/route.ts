import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeHostname, resolveFavicon } from "@/lib/favicon";

export const runtime = "nodejs";

/**
 * GET /api/favicon?url=https://example.com
 * 返回自动匹配到的站点图标，命中 CDN 缓存时不会回源。
 */
export async function GET(request: NextRequest) {
  const raw =
    request.nextUrl.searchParams.get("url") ??
    request.nextUrl.searchParams.get("domain") ??
    "";
  const host = normalizeHostname(raw);

  if (!host) {
    return new NextResponse("invalid url", { status: 400 });
  }

  let icon = null;
  try {
    icon = await resolveFavicon(host);
  } catch {
    icon = null;
  }

  if (!icon) {
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }

  return new NextResponse(new Blob([icon.data], { type: icon.mimeType }), {
    status: 200,
    headers: {
      "Content-Type": icon.mimeType,
      "Cache-Control":
        "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400",
    },
  });
}

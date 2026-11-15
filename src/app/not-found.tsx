import Link from "next/link";

export default function NotFound() {
  return (
    <div className="glass-card-static flex flex-col items-center gap-6 px-8 py-20 text-center">
      <h1
    className="text-6xl font-bold text-brand"
  >
        404
      </h1>
      <p className="text-muted">页面不存在或已被移除</p>
      <Link
        href="/"
        className="rounded-full px-6 py-2 text-sm font-medium text-onbrand transition-opacity hover:opacity-90"
        style={{ background: "var(--color-brand)" }}
      >
        返回首页
      </Link>
    </div>
  );
}

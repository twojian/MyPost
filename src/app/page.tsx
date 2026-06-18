import Link from "next/link";
import Image from "next/image";
import { FileText, Hash, Globe, Archive, Mail, GitBranch } from "lucide-react";
import ClockWidget from "@/components/home/ClockWidget";
import CalendarWidget from "@/components/home/CalendarWidget";
import MusicPlayer from "@/components/home/MusicPlayer";
import RandomPost from "@/components/home/RandomPost";
import { getAllPosts } from "@/lib/posts";

const NAV_LINKS = [
  { href: "/posts", label: "近期文章", icon: FileText },
  { href: "/tags", label: "标签", icon: Hash },
  { href: "/categories", label: "分类", icon: Globe },
  { href: "/archives", label: "归档", icon: Archive },
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/twojian",
    label: "GitHub",
    icon: GitBranch,
    style: { background: "#24292e", color: "#fff" },
  },
  {
    href: "mailto:twojian6@gmail.com",
    label: "邮件",
    icon: Mail,
    style: { background: "var(--color-brand)", color: "#fff" },
  },
];

export default function HomePage() {
  const posts = getAllPosts();
  const latestPost = posts[0] ?? null;

  return (
    <div className="flex flex-col gap-8">
      {/* ===== Bento (lg+) — absolute positioning, content-fitted sizes ===== */}
      <div
        className="relative mx-auto hidden lg:block"
        style={{ width: "1000px", height: "660px" }}
      >
        {/* ── NAV card (spans 2 rows) ── */}
        <div
          className="flex flex-col p-6"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 280,
            height: 430,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/images/avatar.png"
              alt="Twojian"
              width={40}
              height={40}
              className="rounded-full border-2 border-white/70"
            />
            <div>
              <p className="font-display text-base font-semibold" style={{ color: "var(--color-brand)" }}>
                Twojian
              </p>
              <p className="text-xs" style={{ color: "var(--color-secondary)" }}>
                开发中
              </p>
            </div>
          </div>

          <p className="mb-3 text-xs uppercase tracking-widest" style={{ color: "var(--color-secondary)" }}>
            GENERAL
          </p>

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-white/40"
                style={{ color: "var(--color-primary)" }}
              >
                <Icon size={15} style={{ color: "var(--color-brand)" }} />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── BANNER (center-top) ── */}
        <div
          className="overflow-hidden p-2"
          style={{
            position: "absolute",
            top: 0,
            left: 296,
            width: 360,
            height: 180,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
          }}
        >
          <Image
            src="/images/welcome-banner.svg"
            alt="Banner"
            width={900}
            height={160}
            className="h-full w-full object-cover"
            style={{ borderRadius: "40px" }}
            priority
          />
        </div>

        {/* ── HERO card (center, uses original avatar) ── */}
        <div
          className="flex flex-col items-center justify-center gap-3 p-6 text-center"
          style={{
            position: "absolute",
            top: 196,
            left: 296,
            width: 360,
            height: 290,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
          }}
        >
          {/* Avatar in a soft teal oval — mirrors target site's cat in yellow circle */}
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full shadow-inner"
            style={{ background: "rgba(255,235,180,0.55)" }}
          >
            <Image
              src="/images/avatar.png"
              alt="Twojian avatar"
              width={96}
              height={96}
              className="rounded-full object-cover shadow-sm"
              style={{ border: "3px solid rgba(255,255,255,0.75)" }}
            />
            {/* Online dot */}
            <span
              className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white"
              style={{ background: "var(--color-brand)" }}
            />
          </div>

          <div>
            <p className="text-base font-semibold" style={{ color: "var(--color-secondary)" }}>
              Good day! 👋
            </p>
            <p className="mt-1 text-xl" style={{ color: "var(--color-primary)" }}>
              I&apos;m{" "}
              <span className="font-display font-bold" style={{ color: "var(--color-brand)" }}>
                Twojian
              </span>
              , nice to meet you!
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--color-secondary)" }}>
              AI Infra · 深度学习 · 考研 · 全栈开发
              <br />
              记录可复用、可验证、可长期维护的知识
            </p>
          </div>
        </div>

        {/* ── 时钟 ── */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 672,
            width: 230,
            height: 120,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <ClockWidget />
        </div>

        {/* ── 最新文章 ── */}
        <div style={{ position: "absolute", top: 446, left: -40, width: 280, height: 160 }}>
          {latestPost ? (
            <Link href={`/posts/${latestPost.slug}`} className="block h-full">
              <div
                className="flex h-full flex-col px-5 py-5"
                style={{
                  background: "rgba(255,255,255,0.4)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  borderRadius: "48px",
                }}
              >
                <p className="mb-2 text-xs font-medium" style={{ color: "var(--color-secondary)" }}>
                  最新文章
                </p>
                <p
                  className="mb-1 line-clamp-3 flex-1 text-sm font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {latestPost.title}
                </p>
                {latestPost.summary && (
                  <p className="mb-2 line-clamp-2 text-xs" style={{ color: "var(--color-secondary)" }}>
                    {latestPost.summary}
                  </p>
                )}
                <p className="text-xs" style={{ color: "var(--color-secondary)" }}>
                  {latestPost.date}
                </p>
              </div>
            </Link>
          ) : (
            <div
              className="h-full px-5 py-5"
              style={{
                background: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                borderRadius: "48px",
              }}
            >
              <p className="text-xs" style={{ color: "var(--color-secondary)" }}>
                暂无文章
              </p>
            </div>
          )}
        </div>

        {/* ── SOCIAL links ── */}
        <div
          className="flex items-center justify-center gap-3"
          style={{ position: "absolute", top: 502, left: 296, width: 360, height: 64 }}
        >
          {SOCIAL_LINKS.map(({ href, label, icon: Icon, style }) => (
            <Link
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition-transform hover:scale-105"
              style={style}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        {/* ── CALENDAR (spans 2 rows) ── */}
        <div
          style={{
            position: "absolute",
            top: 146,
            left: 672,
            width: 328,
            height: 340,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
            overflow: "hidden",
          }}
        >
          <CalendarWidget />
        </div>

        {/* ── RANDOM post ── */}
        <div
          style={{
            position: "absolute",
            top: 582,
            left: 296,
            width: 280,
            height: 80,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
            overflow: "hidden",
          }}
        >
          <RandomPost posts={posts} />
        </div>

        {/* ── MUSIC player ── */}
        <div
          style={{
            position: "absolute",
            top: 502,
            left: 620,
            width: 328,
            height: 80,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
            overflow: "hidden",
          }}
        >
          <MusicPlayer
            title="One Last Kiss"
            artist="宇多田ヒカル"
            src="/audio/one-last-kiss.mp3"
          />
        </div>
      </div>

      {/* ===== Mobile hero ===== */}
      <div className="lg:hidden">
        <div className="squircle mb-3 overflow-hidden">
          <Image
            src="/images/welcome-banner.svg"
            alt="Banner"
            width={900}
            height={160}
            className="h-auto w-full"
          />
        </div>
        <div className="glass-card-static squircle flex items-center gap-5 px-6 py-7">
          <Image
            src="/images/avatar.png"
            alt="Twojian"
            width={72}
            height={72}
            className="shrink-0 rounded-full border-4 border-white/60 shadow-sm"
          />
          <div>
            <p className="font-display text-xl font-bold" style={{ color: "var(--color-brand)" }}>
              Twojian
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--color-secondary)" }}>
              AI Infra · 深度学习 · 考研 · 全栈开发
              <br />
              记录可复用、可验证、可长期维护的知识
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

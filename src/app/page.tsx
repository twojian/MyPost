'use client';

import Link from "next/link";
import Image from "next/image";
import { FileText, Hash, Globe, Archive } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import ClockWidget from "@/components/home/ClockWidget";
import CalendarWidget from "@/components/home/CalendarWidget";
import MusicPlayer from "@/components/home/MusicPlayer";
import RandomPost from "@/components/home/RandomPost";
import Toast from "@/components/ui/Toast";
import type { PostMeta } from "@/lib/posts";

interface CardLayout {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  visible: boolean;
}

interface SiteConfig {
  banner: { type: 'image' | 'video'; image: string; video: string };
  hero: { greeting: string; name: string; description: string };
  tags: Record<string, any>;
}

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
    icon: "/logo-github.png",
    style: { background: "transparent" },
  },
  {
    href: "https://www.xiaohongshu.com/user/profile/5cb1ff7b00000000170077d3",
    label: "小红书",
    icon: "/手机APP图标-小红书.png",
    style: { background: "transparent" },
  },
  {
    href: "mailto:twojian6@gmail.com",
    label: "邮件",
    icon: "/谷歌邮箱应用图标logo.png",
    style: { background: "transparent" },
    copyEmail: true,
  },
];

export default function HomePage() {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [latestPost, setLatestPost] = useState<PostMeta | null>(null);
  const [layout, setLayout] = useState<Record<string, CardLayout>>({});
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setLatestPost(data.latestPost || null);
      })
      .catch(err => console.error('Failed to load posts:', err));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setLayout(data.layout);
        setSiteConfig(data.siteConfig);
      })
      .catch(err => console.error('Failed to load config:', err));
  }, []);

  const card = useCallback((id: string) => {
    return layout[id] ?? { x: 0, y: 0, w: 200, h: 100, visible: true };
  }, [layout]);

  const handleCopyEmail = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('twojian6@gmail.com').then(() => {
      setToastMessage('邮箱地址已复制');
      setToastVisible(true);
    }).catch(err => {
      console.error('复制失败:', err);
      setToastMessage('复制失败，请手动复制');
      setToastVisible(true);
    });
  }, []);

  if (!siteConfig) {
    return <div className="py-20 text-center text-[var(--color-secondary)]">加载中...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Toast notification */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* ===== Bento (lg+) — absolute positioning, content-fitted sizes ===== */}
      <div
        className="relative mx-auto hidden lg:block"
        style={{ width: "1000px", height: "660px" }}
      >
        {/* ── NAV card ── */}
        {card('nav').visible && (<div
          className="flex flex-col p-6"
          style={{
            position: "absolute",
            top: card('nav').y,
            left: card('nav').x,
            width: card('nav').w,
            height: card('nav').h,
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
        </div>)}

        {/* ── BANNER ── */}
        {card('banner').visible && (<div
          className="overflow-hidden p-2"
          style={{
            position: "absolute",
            top: card('banner').y,
            left: card('banner').x,
            width: card('banner').w,
            height: card('banner').h,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
          }}
        >
          {siteConfig.banner.type === 'video' ? (
            <video
              src={siteConfig.banner.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              style={{ borderRadius: "40px" }}
            />
          ) : (
            <Image
              src={siteConfig.banner.image}
              alt="Banner"
              width={900}
              height={160}
              className="h-full w-full object-cover"
              style={{ borderRadius: "40px" }}
              priority
            />
          )}
        </div>)}

        {/* ── HERO card ── */}
        {card('hero').visible && (<div
          className="flex flex-col items-center justify-center gap-3 p-6 text-center"
          style={{
            position: "absolute",
            top: card('hero').y,
            left: card('hero').x,
            width: card('hero').w,
            height: card('hero').h,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
          }}
        >
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
            <span
              className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white"
              style={{ background: "var(--color-brand)" }}
            />
          </div>

          <div>
            <p className="text-base font-semibold" style={{ color: "var(--color-secondary)" }}>
              {siteConfig.hero.greeting}
            </p>
            <p className="mt-1 text-xl" style={{ color: "var(--color-primary)" }}>
              I'm{" "}
              <span className="font-display font-bold" style={{ color: "var(--color-brand)" }}>
                {siteConfig.hero.name}
              </span>
              , nice to meet you!
            </p>
            <p className="mt-2 text-xs leading-relaxed whitespace-pre-line" style={{ color: "var(--color-secondary)" }}>
              {siteConfig.hero.description}
            </p>
          </div>
        </div>)}

        {/* ── 时钟 ── */}
        {card('clock').visible && (<div
          style={{
            position: "absolute",
            top: card('clock').y,
            left: card('clock').x,
            width: card('clock').w,
            height: card('clock').h,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <ClockWidget />
        </div>)}

        {/* ── 最新文章 ── */}
        {card('latest-post').visible && (<div style={{
          position: "absolute",
          top: card('latest-post').y,
          left: card('latest-post').x,
          width: card('latest-post').w,
          height: card('latest-post').h,
        }}>
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
        </div>)}

        {/* ── SOCIAL links ── */}
        {card('social').visible && (<div
          className="flex items-center justify-center gap-3"
          style={{
            position: "absolute",
            top: card('social').y,
            left: card('social').x,
            width: card('social').w,
            height: card('social').h,
          }}
        >
          {SOCIAL_LINKS.map(({ href, label, icon, style, copyEmail }) => (
            copyEmail ? (
              <button
                key={href}
                onClick={handleCopyEmail}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-transform hover:scale-105"
                style={style}
              >
                <Image
                  src={icon}
                  alt={label}
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                {label}
              </button>
            ) : (
              <Link
                key={href}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-transform hover:scale-105"
                style={style}
              >
                <Image
                  src={icon}
                  alt={label}
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                {label}
              </Link>
            )
          ))}
        </div>)}

        {/* ── CALENDAR ── */}
        {card('calendar').visible && (<div
          style={{
            position: "absolute",
            top: card('calendar').y,
            left: card('calendar').x,
            width: card('calendar').w,
            height: card('calendar').h,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
            overflow: "hidden",
          }}
        >
          <CalendarWidget />
        </div>)}

        {/* ── RANDOM post ── */}
        {card('random-post').visible && (<div
          style={{
            position: "absolute",
            top: card('random-post').y,
            left: card('random-post').x,
            width: card('random-post').w,
            height: card('random-post').h,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: "48px",
            overflow: "hidden",
          }}
        >
          <RandomPost posts={posts} />
        </div>)}

        {/* ── MUSIC player ── */}
        {card('music').visible && (<div
          style={{
            position: "absolute",
            top: card('music').y,
            left: card('music').x,
            width: card('music').w,
            height: card('music').h,
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
        </div>)}
      </div>

      {/* ===== Mobile hero ===== */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="squircle mb-1 overflow-hidden">
          {siteConfig.banner.type === 'video' ? (
            <video
              src={siteConfig.banner.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-auto w-full"
            />
          ) : (
            <Image
              src={siteConfig.banner.image}
              alt="Banner"
              width={900}
              height={160}
              className="h-auto w-full"
            />
          )}
        </div>

        {/* Profile card */}
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
              {siteConfig.hero.name}
            </p>
            <p className="mt-1 text-sm whitespace-pre-line" style={{ color: "var(--color-secondary)" }}>
              {siteConfig.hero.description}
            </p>
          </div>
        </div>

        {/* Clock + Calendar — stack on tiny screens, side-by-side on sm+ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="glass-card-static squircle overflow-hidden" style={{ minHeight: 120 }}>
            <ClockWidget />
          </div>
          <div className="glass-card-static squircle overflow-hidden" style={{ minHeight: 160 }}>
            <CalendarWidget />
          </div>
        </div>

        {/* Nav links — 2 cols on small, 4 cols on tablet */}
        <div className="glass-card-static squircle px-4 py-4 sm:px-6 sm:py-5">
          <p className="mb-2 text-[10px] uppercase tracking-widest sm:mb-3 sm:text-xs" style={{ color: "var(--color-secondary)" }}>
            导航
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-4">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors hover:bg-white/40 sm:py-2.5 sm:text-sm"
                style={{ color: "var(--color-primary)" }}
              >
                <Icon size={15} style={{ color: "var(--color-brand)" }} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Latest post + Random post — side-by-side on tablet */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {latestPost && (
            <Link href={`/posts/${latestPost.slug}`} className="block">
              <div className="glass-card-static squircle h-full px-4 py-4 sm:px-6 sm:py-5">
                <p className="mb-1.5 text-[10px] font-medium sm:mb-2 sm:text-xs" style={{ color: "var(--color-secondary)" }}>
                  最新文章
                </p>
                <p className="mb-1 line-clamp-2 text-xs font-semibold sm:text-sm" style={{ color: "var(--color-primary)" }}>
                  {latestPost.title}
                </p>
                {latestPost.summary && (
                  <p className="mb-1.5 line-clamp-2 text-[10px] sm:mb-2 sm:text-xs" style={{ color: "var(--color-secondary)" }}>
                    {latestPost.summary}
                  </p>
                )}
                <p className="text-[10px] sm:text-xs" style={{ color: "var(--color-secondary)" }}>
                  {latestPost.date}
                </p>
              </div>
            </Link>
          )}

          <div className="glass-card-static squircle overflow-hidden" style={{ minHeight: 80 }}>
            <RandomPost posts={posts} />
          </div>
        </div>

        {/* Music + Social — side-by-side on tablet */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="glass-card-static squircle overflow-hidden" style={{ minHeight: 72 }}>
            <MusicPlayer
              title="One Last Kiss"
              artist="宇多田ヒカル"
              src="/audio/one-last-kiss.mp3"
            />
          </div>

          <div className="flex items-center justify-center gap-3 py-2">
            {SOCIAL_LINKS.map(({ href, label, icon, style, copyEmail }) => (
              copyEmail ? (
                <button
                  key={href}
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-sm transition-transform hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm"
                  style={style}
                >
                  <Image
                    src={icon}
                    alt={label}
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  {label}
                </button>
              ) : (
                <Link
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-sm transition-transform hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm"
                  style={style}
                >
                  <Image
                    src={icon}
                    alt={label}
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  {label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

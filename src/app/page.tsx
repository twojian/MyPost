import Link from "next/link";
import Image from "next/image";
import { Mail, GitBranch } from "lucide-react";
import ClockWidget from "@/components/home/ClockWidget";
import CalendarWidget from "@/components/home/CalendarWidget";
import MusicPlayer from "@/components/home/MusicPlayer";
import RandomPost from "@/components/home/RandomPost";
import BentoTransition from "@/components/home/BentoTransition";
import { getAllPosts } from "@/lib/posts";
import { HOME_SHORTCUTS } from "@/lib/nav";
import { mailtoHref, siteConfig } from "@/lib/site-config";

/** 社交入口：底色统一走语义变量，避免各处各写一份色值 */
const SOCIAL_LINKS = [
  {
    href: siteConfig.github,
    label: siteConfig.githubLabel,
    icon: GitBranch,
    bg: "var(--color-github)",
  },
  {
    href: mailtoHref,
    label: siteConfig.emailLabel,
    icon: Mail,
    bg: "var(--color-brand)",
  },
];

export default function HomePage() {
  const posts = getAllPosts();
  const latestPost = posts[0] ?? null;

  return (
    <div className="flex flex-col gap-8">
      {/* ===== Bento —— 单一 DOM：<1080px 纵向堆叠，≥1080px 绝对定位（坐标见 globals.css） ===== */}
      <div className="home-bento">
        {/* 断点切换时的一次性入场动画（无 DOM 输出）；见 BentoTransition */}
        <BentoTransition />

        {/* ── ① 时钟 ── */}
        <div className="bento-card bento-clock">
          <ClockWidget />
        </div>

        {/* ── ② 日历 ── */}
        <div className="bento-card bento-calendar bento-surface">
          <CalendarWidget />
        </div>

        {/* ── ③ 横幅 ── */}
        <div className="bento-card bento-banner bento-surface overflow-hidden p-2">
          <Image
            src="/images/yantai-banner.jpg"
            alt="Banner"
            width={1600}
            height={1067}
            className="h-full w-full object-cover"
            style={{ borderRadius: "40px" }}
            priority
          />
        </div>

        {/* ── ④ 头像 ── */}
        <div className="bento-card bento-hero bento-surface flex flex-col items-center justify-center gap-3 p-6 text-center">
          {/* Avatar：圆形裁切（rounded-full，不加描边与光环底色） */}
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full">
            <Image
              src="/images/ayanami.jpg"
              alt="Twojian avatar"
              width={96}
              height={96}
              className="rounded-full object-cover shadow-sm"
            />
            {/* Online dot */}
            <span
              className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-[var(--color-on-brand)]"
              style={{ background: "var(--color-brand)" }}
            />
          </div>

          <div>
            <p
       className="font-display text-2xl leading-relaxed text-fg"
     >
              I&apos;m{" "}
              <span className="font-bold text-brand">
                twojian
              </span>
              {" ,"}
              <br />
              Nice to
              <br />
              meet you!
            </p>
          </div>
        </div>

        {/* ── ⑤ 导航（宽屏跨两行） ── */}
        <div className="bento-card bento-nav bento-surface flex flex-col p-6">
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/images/ayanami.jpg"
              alt="Twojian"
              width={40}
              height={40}
              className="rounded-full border-2 border-[var(--color-on-brand)] object-cover"
            />
            <div>
              <p className="font-display text-base font-semibold text-brand">
                {siteConfig.name}
              </p>
              <p className="text-xs text-muted">{siteConfig.tagline}</p>
            </div>
          </div>

          <p className="mb-3 text-xs uppercase tracking-widest text-muted">
            GENERAL
          </p>

          <nav className="flex flex-col gap-1">
            {HOME_SHORTCUTS.map(({ href, label, icon: Icon }) => (
              <Link
        key={href}
        href={href}
        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors row-hover text-fg"
      >
                <Icon size={15} className="text-brand" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── ⑥ 最新文章 ── */}
        <div className="bento-card bento-latest bento-surface">
          {latestPost ? (
            <Link href={`/posts/${latestPost.slug}`} className="block h-full">
              <div className="flex h-full flex-col px-5 py-5">
                <p className="mb-2 text-xs font-medium text-muted">
                  最新文章
                </p>
                <p
         className="mb-1 line-clamp-3 flex-1 text-sm font-semibold text-fg"
       >
                  {latestPost.title}
                </p>
                {latestPost.summary && (
                  <p className="mb-2 line-clamp-2 text-xs text-muted">
                    {latestPost.summary}
                  </p>
                )}
                <p className="text-xs text-muted">
                  {latestPost.date}
                </p>
              </div>
            </Link>
          ) : (
            <div className="h-full px-5 py-5">
              <p className="text-xs text-muted">
                暂无文章
              </p>
            </div>
          )}
        </div>

        {/* ── ⑦ 随机推荐 ── */}
        <div className="bento-card bento-random bento-surface overflow-hidden">
          <RandomPost posts={posts} />
        </div>

        {/* ── ⑧ 音乐 ── */}
        <div className="bento-card bento-music bento-surface overflow-hidden">
          <MusicPlayer
            title="One Last Kiss"
            artist="宇多田ヒカル"
            src="/audio/one-last-kiss.mp3"
          />
        </div>

        {/* ── ⑨ 社交 ── */}
        <div className="bento-card bento-social flex items-center justify-center gap-3">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon, bg }) => (
            <Link
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-onbrand shadow-sm transition-transform hover:scale-105"
              style={{ background: bg }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

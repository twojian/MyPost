import Image from "next/image";
import Link from "next/link";
import { FileText, Hash } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="glass-card-static sticky top-28 flex flex-col gap-5 p-6">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Image
            src="/images/avatar.png"
            alt="Twojian"
            width={96}
            height={96}
            className="rounded-full border-4 border-white/70 shadow-sm"
          />
          <span
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white"
            style={{ background: "var(--color-brand)" }}
            aria-label="online"
          />
        </div>
        <div className="text-center">
          <h2
            className="font-display text-xl"
            style={{ color: "var(--color-primary)" }}
          >
            Twojian
          </h2>
          <p
            className="text-xs"
            style={{ color: "var(--color-secondary)" }}
          >
            计算机考研 · AI · 全栈
          </p>
        </div>
      </div>

      {/* Bio */}
      <p
        className="text-center text-xs leading-relaxed"
        style={{ color: "var(--color-secondary)" }}
      >
        记录可复用、可验证、可长期维护的知识
      </p>

      <hr className="border-white/30" />

      {/* Quick links */}
      <nav className="flex flex-col gap-2 text-sm">
        <Link
          href="/posts"
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-white/30"
          style={{ color: "var(--color-secondary)" }}
        >
          <FileText size={14} />
          <span>所有文章</span>
        </Link>
        <Link
          href="/tags"
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-white/30"
          style={{ color: "var(--color-secondary)" }}
        >
          <Hash size={14} />
          <span>标签</span>
        </Link>
      </nav>

      <hr className="border-white/30" />

      {/* Socials */}
      <div className="flex justify-center gap-3">
        <Link
          href="https://github.com/twojian"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 transition-colors hover:bg-white/30"
          aria-label="GitHub"
        >
          <Image
            src="/logo-github.png"
            alt="GitHub"
            width={24}
            height={24}
          />
        </Link>
        <Link
          href="mailto:twojian0705@163.com"
          className="rounded-full p-2 transition-colors hover:bg-white/30"
          aria-label="Email"
        >
          <Image
            src="/谷歌邮箱应用图标logo.png"
            alt="Email"
            width={24}
            height={24}
          />
        </Link>
        <Link
          href="https://www.xiaohongshu.com/user/profile/5cb1ff7b00000000170077d3"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-2 transition-colors hover:bg-white/30"
          aria-label="小红书"
        >
          <Image
            src="/手机APP图标-小红书.png"
            alt="小红书"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </aside>
  );
}

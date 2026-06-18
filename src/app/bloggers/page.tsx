import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "博客圈",
  description: "我珍藏的博主友链，欢迎大家也去看看他们的小宇宙。",
};

interface Blogger {
  name: string;
  url: string;
  tagline: string;
  color?: string;
}

// 取自 lvyovo-wiki.tech/bloggers，致敬 & 推广。
const BLOGGERS: Blogger[] = [
  { name: "lvyneko", url: "https://lvyovo-wiki.tech", tagline: "莫西莫西，欢迎 issue / email 添加友链 (=^. .^=)", color: "#f6c6d2" },
  { name: "Anthony Fu", url: "https://antfu.me/", tagline: "Vue core team，神做事就像喝水一样轻松", color: "#42b883" },
  { name: "Innei 静かな森", url: "https://innei.in/", tagline: "支持高产博主喵", color: "#7cc4f3" },
  { name: "Cassie Evans's Blog", url: "https://www.cassie.codes/", tagline: "GSAP 和 SVG 动画的厉害姐姐 🌈", color: "#f9a8d4" },
  { name: "猫鱼周刊", url: "https://ameow.xyz/", tagline: "快乐划水 (｡･∀･)", color: "#fbbf77" },
  { name: "十玖八柒", url: "https://blog.ahzoo.cn/", tagline: "后端 | Z 次元 ovo", color: "#a78bfa" },
  { name: "Kuro", url: "https://www.elainafan.one/", tagline: "好想像 Kuro 一样会算法啊", color: "#d8b4fe" },
  { name: "loveapple", url: "https://loveapple.icu/", tagline: "RF Engineering | 一条喜欢苹果的水煮鱼 🎣", color: "#fca5a5" },
  { name: "Jerry Yang", url: "https://efjerryyang.github.io/", tagline: "Rust | All in", color: "#fb923c" },
  { name: "nanarino", url: "https://nanarino.art", tagline: "Painter | 喜欢逛 CP、捡谷子，温柔记录世界。", color: "#ffd5b8" },
  { name: "Satoru", url: "https://www.vanishcode.com/", tagline: "全栈的前辈", color: "#60a5fa" },
  { name: "Jesse Zhang", url: "https://blog.nagi.fun", tagline: "成为榜样而不是偶像 (・∀・)", color: "#34d399" },
  { name: "Morlvoid", url: "https://www.morlvoid.pro", tagline: "事已至此，先睡觉吧", color: "#a3a3a3" },
  { name: "RainMorime", url: "https://rainmorime.com", tagline: "你我命运于此刻纠缠不休", color: "#93c5fd" },
  { name: "AkiDAY. 孤星邮局", url: "https://blog.akiday.com", tagline: "永远是秋日有多好", color: "#fda4af" },
  { name: "Landigo's Garden", url: "https://blog.minecraftglz.top", tagline: "Never be afraid of your inner power", color: "#86efac" },
  { name: "1pitaph", url: "https://1pitaph.com", tagline: "If it's hard to learn, it's a valuable knowledge.", color: "#fcd34d" },
  { name: "时隐", url: "https://shiyin.cafe", tagline: "未来主义建造者 | 好酷的网站", color: "#c4b5fd" },
  { name: "Eric-Terminal", url: "https://blog.ericterminal.com", tagline: "无敌的高二学弟", color: "#5eead4" },
  { name: "空と海", url: "https://blog.chiyo.uk", tagline: "就算活著沒有意義，偶而還是會碰到好事的", color: "#bae6fd" },
  { name: "Andy Jiang", url: "https://jiangmuran.com", tagline: "Hackathon 认识的强强初中生 ㄒoㄒ", color: "#fcd34d" },
  { name: "Tonsky", url: "https://tonsky.me", tagline: "页面很亮的极客", color: "#fde68a" },
];

function initials(name: string) {
  // 取首字（中文用第一个字符，英文取首字母）
  const ch = name.trim().charAt(0);
  return ch.toUpperCase();
}

export default function BloggersPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        博客圈
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--color-secondary)" }}>
        想多看看大家的小宇宙，所以做了这个友链页——按下卡片直达博客主页，致敬每一位认真写作的朋友。
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BLOGGERS.map((b) => (
          <a
            key={b.url}
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card squircle flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5"
            style={{ borderRadius: "24px" }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-white shadow-sm"
              style={{ background: b.color ?? "var(--color-brand)" }}
            >
              {initials(b.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p
                  className="line-clamp-1 text-sm font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {b.name}
                </p>
                <ExternalLink size={11} style={{ color: "var(--color-secondary)" }} />
              </div>
              <p
                className="line-clamp-2 text-xs leading-relaxed"
                style={{ color: "var(--color-secondary)" }}
              >
                {b.tagline}
              </p>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-8 text-center text-xs" style={{ color: "var(--color-secondary)" }}>
        想添加友链？欢迎通过 <a href="mailto:twojian6@gmail.com" style={{ color: "var(--color-brand)" }}>邮件</a> 联系我。
      </p>
    </>
  );
}

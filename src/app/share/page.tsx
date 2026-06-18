import type { Metadata } from "next";
import { ExternalLink, Eye, Bookmark } from "lucide-react";

export const metadata: Metadata = {
  title: "分享",
  description: "我珍藏的优秀技术专栏与资源——欢迎一起学习。",
};

interface Column {
  title: string;
  url: string;
  source: string;
  tags: string[];
  desc?: string;
  views?: number;
  marks?: number;
}

const COLUMNS: Column[] = [
  { title: "Linux os+net", url: "https://blog.csdn.net/2301_80171004/category_12699620.html", source: "lvyneko 专栏", tags: ["OS"], views: 141040, marks: 2721 },
  { title: "LLM | SLM | vLLM", url: "https://blog.csdn.net/2301_80171004/category_13034013.html", source: "lvyneko 专栏", tags: ["LLM"], views: 59257, marks: 1061 },
  { title: "Problem Solving", url: "https://blog.csdn.net/2301_80171004/category_12739657.html", source: "lvyneko 专栏", tags: ["Tools/Methods"], desc: "熟练配置各种平台的运行环境，快速熟练解决冲突和报错。", views: 34182, marks: 234 },
  { title: "CMU 15-445 & 大数据", url: "https://blog.csdn.net/2301_80171004/category_12991139.html", source: "lvyneko 专栏", tags: ["DB"], desc: "一些 lab、架构、文档笔记，踩坑...", views: 18367, marks: 320 },
  { title: "AIoT", url: "https://blog.csdn.net/2301_80171004/category_13015780.html", source: "lvyneko 专栏", tags: ["IoT/Embedded"], desc: "AI 与嵌入式落地的学习实践记录。", views: 36505, marks: 690 },
  { title: "Redis 文档学习", url: "https://blog.csdn.net/2301_80171004/category_12835991.html", source: "lvyneko 专栏", tags: ["DB", "Backend"], desc: "从缓存到数据结构，快 & 并发。", views: 34380, marks: 480 },
  { title: "MySQL", url: "https://blog.csdn.net/2301_80171004/category_12816209.html", source: "lvyneko 专栏", tags: ["DB", "Backend"], desc: "查询优化、索引设计、事务隔离，一步步把数据库用明白。", views: 32430, marks: 428 },
  { title: "Docker & YAML", url: "https://blog.csdn.net/2301_80171004/category_12827592.html", source: "lvyneko 专栏", tags: ["Backend"], desc: "容器化部署不再玄学。", views: 32940, marks: 498 },
  { title: "CUDA", url: "https://blog.csdn.net/2301_80171004/category_13008959.html", source: "lvyneko 专栏", tags: ["GPU"], desc: "基于 2023 NVIDIA's CUDA Training Series", views: 24199, marks: 365 },
  { title: "Qt & LVGL", url: "https://blog.csdn.net/2301_80171004/category_12868545.html", source: "lvyneko 专栏", tags: ["IoT/Embedded"], desc: "桌面 to 嵌入式界面。", views: 41479, marks: 600 },
  { title: "TypeScript & JavaScript", url: "https://blog.csdn.net/2301_80171004/category_13002615.html", source: "lvyneko 专栏", tags: ["Frontend"], desc: "从语法糖到工程化，前端从能跑提升到好维护。", views: 42193, marks: 672 },
  { title: "Unmanned Aerial Vehicle", url: "https://blog.csdn.net/2301_80171004/category_13068150.html", source: "lvyneko 专栏", tags: ["IoT/Embedded"], desc: "无人机，飞控、传感器与任务规划。", views: 14322, marks: 269 },
  { title: "Quantification", url: "https://blog.csdn.net/2301_80171004/category_13064766.html", source: "lvyneko 专栏", tags: ["Domain"], desc: "策略想法 to 可回测、可复盘、可迭代的量化流程。", views: 16670, marks: 265 },
  { title: "C++ Libraries & Source Code", url: "https://blog.csdn.net/2301_80171004/category_12990587.html", source: "lvyneko 专栏", tags: ["Programming Language"], desc: "常用库怎么用、源码怎么看。", views: 33468, marks: 592 },
  { title: "Testing | Automation | n8n", url: "https://blog.csdn.net/2301_80171004/category_12933446.html", source: "lvyneko 专栏", tags: ["Tools/Methods"], desc: "重复工作自动化，测试从负担到生产力增幅器。", views: 68809, marks: 890 },
  { title: "Audio & Video", url: "https://blog.csdn.net/2301_80171004/category_12991802.html", source: "lvyneko 专栏", tags: ["Domain"], desc: "编解码、推流和处理链路拆开来讲，音视频学习不再劝退。", views: 29273, marks: 483 },
  { title: "Python Lib & Source Code", url: "https://blog.csdn.net/2301_80171004/category_12989252.html", source: "lvyneko 专栏", tags: ["Programming Language"], desc: "用 Python 写出高质量工程代码。", views: 30830, marks: 624 },
  { title: "Computer Vision", url: "https://blog.csdn.net/2301_80171004/category_13008708.html", source: "lvyneko 专栏", tags: ["Domain"], desc: "图像处理到视觉模型实践，可落地。", views: 45614, marks: 771 },
  { title: "Reading Notes", url: "https://blog.csdn.net/2301_80171004/category_12930270.html", source: "lvyneko 专栏", tags: ["Learning"], desc: "黑色神话。", views: 20524, marks: 327 },
  { title: "World Labs", url: "https://marble.worldlabs.ai/", source: "Track", tags: ["世界模型"] },
];

const TAG_COLORS: Record<string, string> = {
  OS: "#5b9aff",
  LLM: "#b07cff",
  DB: "#ff9b6e",
  Backend: "#35bfab",
  Frontend: "#ff7a9c",
  "IoT/Embedded": "#7ec8a0",
  "Tools/Methods": "#f1c40f",
  "Programming Language": "#56c3e9",
  Domain: "#a085d6",
  Learning: "#e87b7b",
  GPU: "#76b900",
  "世界模型": "#7d6ad6",
};

function tagColor(t: string) {
  return TAG_COLORS[t] ?? "var(--color-brand)";
}

export default function SharePage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        分享
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--color-secondary)" }}>
        珍藏的优秀技术专栏。点击卡片直达原文，源自社区各位博主的辛勤分享。
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {COLUMNS.map((c) => (
          <a
            key={c.url}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card squircle flex flex-col gap-2 p-5 transition-transform hover:-translate-y-0.5"
            style={{ borderRadius: "28px" }}
          >
            <div className="flex items-start justify-between gap-3">
              <p
                className="text-base font-semibold leading-tight"
                style={{ color: "var(--color-primary)" }}
              >
                {c.title}
              </p>
              <ExternalLink size={14} style={{ color: "var(--color-secondary)" }} />
            </div>

            <p className="text-xs" style={{ color: "var(--color-secondary)" }}>
              {c.source}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2 py-0.5 text-[11px]"
                  style={{
                    background: `${tagColor(t)}1f`,
                    color: tagColor(t),
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {c.desc && (
              <p
                className="line-clamp-2 text-xs leading-relaxed"
                style={{ color: "var(--color-secondary)" }}
              >
                {c.desc}
              </p>
            )}

            {(c.views !== undefined || c.marks !== undefined) && (
              <div className="mt-1 flex items-center gap-3 text-xs" style={{ color: "var(--color-secondary)" }}>
                {c.views !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Eye size={12} /> {c.views.toLocaleString()}
                  </span>
                )}
                {c.marks !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Bookmark size={12} /> {c.marks.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </a>
        ))}
      </div>
    </>
  );
}

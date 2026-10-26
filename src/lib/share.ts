/**
 * 分享专栏数据：按知识大类划分，收录多位博主的文章与专栏。
 * 作者：杜子源（dlog.com.cn）、二丫讲梵（wiki.eryajf.net）、阮一峰（ruanyifeng.com），
 * 其余专栏取自 lvyovo-wiki.tech/bloggers 博客圈。
 */

export interface ShareItem {
  /** 卡片标题（文章名 / 专栏名） */
  title: string;
  /** 跳转链接 */
  url: string;
  /** 作者或博主名 */
  author: string;
  /** 作者站点 */
  authorUrl: string;
  /** 知识大类 */
  category: string;
  /** 类型：文章 / 专栏 */
  type: "文章" | "专栏";
  /** 一句话简介 */
  desc?: string;
}

/** 每个知识大类的封面渐变与标签主色 */
export const CATEGORY_STYLE: Record<string, { from: string; to: string; accent: string }> = {
  "GPU / AI Infra": { from: "#0d5c56", to: "#2dd4bf", accent: "#14b8a6" },
  "运维 / CI-CD / 监控": { from: "#1e3a8a", to: "#38bdf8", accent: "#3b82f6" },
  "技术周刊 / 观点": { from: "#78350f", to: "#fbbf24", accent: "#f59e0b" },
  "编程语言 / 前端": { from: "#831843", to: "#f472b6", accent: "#ec4899" },
  "效率工具 / 方法": { from: "#3b0764", to: "#a78bfa", accent: "#8b5cf6" },
  "独立博客精选": { from: "#155e75", to: "#22d3ee", accent: "#06b6d4" },
};

export const SHARE_ITEMS: ShareItem[] = [
  // ===== GPU / AI Infra —— 杜子源 dlog.com.cn =====
  {
    title: "Attention 算子：CUDA 实现与优化",
    url: "https://dlog.com.cn/posts/cuda16/attention/",
    author: "杜子源",
    authorUrl: "https://dlog.com.cn",
    category: "GPU / AI Infra",
    type: "文章",
    desc: "从朴素实现到算子级优化，硬核 GPU 编程入门第一课。",
  },
  {
    title: "矩阵乘法：从朴素到高效",
    url: "https://dlog.com.cn/posts/cuda14/matmul/",
    author: "杜子源",
    authorUrl: "https://dlog.com.cn",
    category: "GPU / AI Infra",
    type: "文章",
    desc: "内核设计的经典问题：访存、分块与 Tiling 思路拆解。",
  },
  {
    title: "手写 Norm：LayerNorm 的 CUDA 落地",
    url: "https://dlog.com.cn/posts/cuda12/norm/",
    author: "杜子源",
    authorUrl: "https://dlog.com.cn",
    category: "GPU / AI Infra",
    type: "文章",
    desc: "把 LayerNorm / RMSNorm 从公式写成可跑的 CUDA 内核。",
  },
  {
    title: "从零实现 vLLM【6】：Attention 的实现",
    url: "https://dlog.com.cn/posts/offer07/attention实现/",
    author: "杜子源",
    authorUrl: "https://dlog.com.cn",
    category: "GPU / AI Infra",
    type: "文章",
    desc: "推理框架里 Attention 到底是怎么落地的。",
  },
  {
    title: "从零实现 vLLM【9】：Engine 的整体架构",
    url: "https://dlog.com.cn/posts/offer10/engine/",
    author: "杜子源",
    authorUrl: "https://dlog.com.cn",
    category: "GPU / AI Infra",
    type: "文章",
    desc: "从请求到输出，Engine 内部如何调度与吞吐优化。",
  },
  {
    title: "Awesome AI Infra：GPU 学习资料汇总",
    url: "https://dlog.com.cn/posts/awesomeinfra/awesome/",
    author: "杜子源",
    authorUrl: "https://dlog.com.cn",
    category: "GPU / AI Infra",
    type: "文章",
    desc: "GPU 学习路线 + 优质资料大汇总，收藏慢慢看。",
  },

  // ===== 运维 / CI-CD / 监控 —— 二丫讲梵 wiki.eryajf.net =====
  {
    title: "Jenkinsfile：声明式流水线实践",
    url: "https://wiki.eryajf.net/pages/3298.html",
    author: "二丫讲梵",
    authorUrl: "https://wiki.eryajf.net",
    category: "运维 / CI-CD / 监控",
    type: "文章",
    desc: "从零开始写出可维护的声明式流水线。",
  },
  {
    title: "CMDB 平台建设：运维资产治理",
    url: "https://wiki.eryajf.net/pages/4bcf72/",
    author: "二丫讲梵",
    authorUrl: "https://wiki.eryajf.net",
    category: "运维 / CI-CD / 监控",
    type: "文章",
    desc: "让服务器与配置从散落走向体系化。",
  },
  {
    title: "openLDAP：企业内部统一认证集成",
    url: "https://wiki.eryajf.net/pages/3416.html",
    author: "二丫讲梵",
    authorUrl: "https://wiki.eryajf.net",
    category: "运维 / CI-CD / 监控",
    type: "文章",
    desc: "统一认证与目录服务从部署到接入。",
  },
  {
    title: "Prometheus：CPU 使用率的查询与告警",
    url: "https://wiki.eryajf.net/pages/3814.html",
    author: "二丫讲梵",
    authorUrl: "https://wiki.eryajf.net",
    category: "运维 / CI-CD / 监控",
    type: "文章",
    desc: "指标语义 + 查询语句逐行拆解。",
  },
  {
    title: "Vuepress 全文搜索：接入 meilisearch",
    url: "https://wiki.eryajf.net/pages/dfc792/",
    author: "二丫讲梵",
    authorUrl: "https://wiki.eryajf.net",
    category: "运维 / CI-CD / 监控",
    type: "文章",
    desc: "站内搜索从安装、配置到真正好用。",
  },

  // ===== 技术周刊 / 观点 —— 阮一峰 ruanyifeng.com =====
  {
    title: "科技爱好者周刊（第 415 期）",
    url: "https://www.ruanyifeng.com/blog/2026/10/weekly-issue-415.html",
    author: "阮一峰",
    authorUrl: "https://www.ruanyifeng.com",
    category: "技术周刊 / 观点",
    type: "文章",
    desc: "本周值得关注的科技新闻、观点与工具。",
  },
  {
    title: "周刊（第 413 期）：再见了，React Native",
    url: "https://www.ruanyifeng.com/blog/2026/09/weekly-issue-413.html",
    author: "阮一峰",
    authorUrl: "https://www.ruanyifeng.com",
    category: "技术周刊 / 观点",
    type: "文章",
    desc: "移动端跨端框架十年复盘与行业动向。",
  },
  {
    title: "周刊（第 410 期）：AI 的三种机制",
    url: "https://www.ruanyifeng.com/blog/2026/08/weekly-issue-410.html",
    author: "阮一峰",
    authorUrl: "https://www.ruanyifeng.com",
    category: "技术周刊 / 观点",
    type: "文章",
    desc: "看懂大模型工作的三种基本机制。",
  },
  {
    title: "Dario Amodei：AI 开源是伪命题",
    url: "https://www.ruanyifeng.com/blog/2026/06/anthropic.html",
    author: "阮一峰",
    authorUrl: "https://www.ruanyifeng.com",
    category: "技术周刊 / 观点",
    type: "文章",
    desc: "开源与闭源之争背后的深度访谈。",
  },
  {
    title: "软件会吃软件吗？程序员会不会消失",
    url: "https://www.ruanyifeng.com/blog/2020/05/will-programmers-increase.html",
    author: "阮一峰",
    authorUrl: "https://www.ruanyifeng.com",
    category: "技术周刊 / 观点",
    type: "文章",
    desc: "关于软件产业与程序员职业的经典长文。",
  },

  // ===== 编程语言 / 前端 —— 博客圈专栏 =====
  {
    title: "Anthony Fu",
    url: "https://antfu.me/",
    author: "Anthony Fu",
    authorUrl: "https://antfu.me/",
    category: "编程语言 / 前端",
    type: "专栏",
    desc: "Vue / Vite 核心成员，工具链与工程化的天花板。",
  },
  {
    title: "Innei 静かな森",
    url: "https://innei.in/",
    author: "Innei",
    authorUrl: "https://innei.in/",
    category: "编程语言 / 前端",
    type: "专栏",
    desc: "TypeScript 全栈独立开发，高产又讲究。",
  },
  {
    title: "Cassie Evans",
    url: "https://www.cassie.codes/",
    author: "Cassie Evans",
    authorUrl: "https://www.cassie.codes/",
    category: "编程语言 / 前端",
    type: "专栏",
    desc: "GSAP / SVG 动画，把动效做成艺术。",
  },
  {
    title: "Jerry Yang",
    url: "https://efjerryyang.github.io/",
    author: "Jerry Yang",
    authorUrl: "https://efjerryyang.github.io/",
    category: "编程语言 / 前端",
    type: "专栏",
    desc: "Rust 学习与系统编程实践，All in。",
  },
  {
    title: "Tonsky",
    url: "https://tonsky.me/",
    author: "Tonsky",
    authorUrl: "https://tonsky.me/",
    category: "编程语言 / 前端",
    type: "专栏",
    desc: "前端极客，极简设计语言与硬核思考。",
  },

  // ===== 效率工具 / 方法 =====
  {
    title: "猫鱼周刊",
    url: "https://ameow.xyz/",
    author: "猫鱼周刊",
    authorUrl: "https://ameow.xyz/",
    category: "效率工具 / 方法",
    type: "专栏",
    desc: "每周盘点好用工具与效率资源，快乐划水。",
  },
  {
    title: "1pitaph",
    url: "https://1pitaph.com/",
    author: "1pitaph",
    authorUrl: "https://1pitaph.com/",
    category: "效率工具 / 方法",
    type: "专栏",
    desc: "难学的知识才有价值，学习方法论集散地。",
  },
  {
    title: "Eric-Terminal",
    url: "https://blog.ericterminal.com/",
    author: "Eric",
    authorUrl: "https://blog.ericterminal.com/",
    category: "效率工具 / 方法",
    type: "专栏",
    desc: "少而精的工程实践，后生可畏。",
  },
  {
    title: "loveapple",
    url: "https://loveapple.icu/",
    author: "loveapple",
    authorUrl: "https://loveapple.icu/",
    category: "效率工具 / 方法",
    type: "专栏",
    desc: "射频工程工具箱与生活记录。",
  },
  {
    title: "Obsidian：笔记体系入门",
    url: "https://wiki.eryajf.net/pages/6ed7fe/",
    author: "二丫讲梵",
    authorUrl: "https://wiki.eryajf.net",
    category: "效率工具 / 方法",
    type: "文章",
    desc: "双链笔记从入门到形成自己的体系。",
  },
  {
    title: "时隐",
    url: "https://shiyin.cafe/",
    author: "时隐",
    authorUrl: "https://shiyin.cafe/",
    category: "效率工具 / 方法",
    type: "专栏",
    desc: "未来主义建造者，网站本身就是作品。",
  },

  // ===== 独立博客精选 =====
  {
    title: "lvyneko",
    url: "https://lvyovo-wiki.tech",
    author: "lvyneko",
    authorUrl: "https://lvyovo-wiki.tech",
    category: "独立博客精选",
    type: "专栏",
    desc: "全栈 + 分享专栏，本页的灵感来源。",
  },
  {
    title: "十玖八柒",
    url: "https://blog.ahzoo.cn/",
    author: "十玖八柒",
    authorUrl: "https://blog.ahzoo.cn/",
    category: "独立博客精选",
    type: "专栏",
    desc: "后端 / Z 次元，全栈实践与碎碎念。",
  },
  {
    title: "Kuro",
    url: "https://www.elainafan.one/",
    author: "Kuro",
    authorUrl: "https://www.elainafan.one/",
    category: "独立博客精选",
    type: "专栏",
    desc: "算法与随笔，酷酷的 Kuro。",
  },
  {
    title: "Satoru",
    url: "https://www.vanishcode.com/",
    author: "Satoru",
    authorUrl: "https://www.vanishcode.com/",
    category: "独立博客精选",
    type: "专栏",
    desc: "全栈前辈的踩坑记录与心得。",
  },
  {
    title: "Jesse Zhang",
    url: "https://blog.nagi.fun/",
    author: "Jesse Zhang",
    authorUrl: "https://blog.nagi.fun/",
    category: "独立博客精选",
    type: "专栏",
    desc: "成为榜样而不是偶像。",
  },
  {
    title: "nanarino",
    url: "https://nanarino.art/",
    author: "nanarino",
    authorUrl: "https://nanarino.art/",
    category: "独立博客精选",
    type: "专栏",
    desc: "绘画与温柔记录，逛 CP 捡谷子的日常。",
  },
  {
    title: "AkiDAY · 孤星邮局",
    url: "https://blog.akiday.com/",
    author: "AkiDAY",
    authorUrl: "https://blog.akiday.com/",
    category: "独立博客精选",
    type: "专栏",
    desc: "永远是秋日有多好——随笔与摄影。",
  },
  {
    title: "空と海",
    url: "https://blog.chiyo.uk/",
    author: "空と海",
    authorUrl: "https://blog.chiyo.uk/",
    category: "独立博客精选",
    type: "专栏",
    desc: "前端与生活随笔，日系温柔。",
  },
  {
    title: "Andy Jiang",
    url: "https://jiangmuran.com/",
    author: "Andy Jiang",
    authorUrl: "https://jiangmuran.com/",
    category: "独立博客精选",
    type: "专栏",
    desc: "Hackathon 全栈，初中生也可以很强。",
  },
  {
    title: "RainMorime",
    url: "https://rainmorime.com/",
    author: "RainMorime",
    authorUrl: "https://rainmorime.com/",
    category: "独立博客精选",
    type: "专栏",
    desc: "命运与灵感的随笔。",
  },
  {
    title: "Morlvoid",
    url: "https://www.morlvoid.pro/",
    author: "Morlvoid",
    authorUrl: "https://www.morlvoid.pro/",
    category: "独立博客精选",
    type: "专栏",
    desc: "事已至此，先睡觉吧——前端与高质量输出。",
  },
  {
    title: "Landigo's Garden",
    url: "https://blog.minecraftglz.top/",
    author: "Landigo",
    authorUrl: "https://blog.minecraftglz.top/",
    category: "独立博客精选",
    type: "专栏",
    desc: "独立开发与个人花园，Never be afraid。",
  },
];

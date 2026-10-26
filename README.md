# Twojian Blog

个人技术博客 —— 记录可复用、可验证、可长期维护的知识。

设计语言参考：iPadOS 式毛玻璃、时间轴文章列表、滚动入场动画与 View Transition 页面切换。

## 技术栈

| 领域       | 选型                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| 框架       | Next.js 16.2.9（App Router）· React 19.2.4 · TypeScript                                                          |
| 样式       | Tailwind CSS v4 · @tailwindcss/typography                                                                      |
| 内容       | MDX（`@next/mdx` + `next-mdx-remote` + `gray-matter`）                                                           |
| MDX 渲染管线 | remark-gfm · remark-math · rehype-katex（数学公式）· rehype-pretty-code（Shiki 代码高亮）· rehype-slug / autolink-headings |
| 搜索       | fuse.js（客户端模糊搜索）                                                                                               |
| 数据层（预留）  | drizzle-orm + @neondatabase/serverless · next-auth（beta）                                                       |
| 动画       | 原生 View Transitions · IntersectionObserver 滚动入场                                                                |
| 字体       | Inter（正文）· Averia Gruesa Libre（展示字体）· DSEG（时钟数码管）                                                              |

## 目录结构

```
.
├── content/posts/            # 文章内容（MDX），slug = 相对路径
│   ├── notes/                # 学习笔记：ai-infra / deep-learning / minimind / nlp
│   ├── tutorials/            # 教程：latex / n8n
│   ├── blog/                 # 随笔
│   └── articles/             # 文章
├── public/
│   ├── images/               # 头像、横幅（welcome-banner.svg / yantai-banner.jpg）
│   ├── videos/               # 全屏背景视频（瑞士夜景 1920×1080）
│   └── audio/                # 音乐播放器音频
└── src/
    ├── app/                  # App Router 页面
    │   ├── page.tsx          # 首页 Bento 布局
    │   ├── posts/            # 文章列表（时间轴）+ 文章详情（MDX 渲染）
    │   ├── share/            # 分享专栏（搜索 + 分类筛选 + 卡片网格）
    │   ├── bloggers/         # 博客圈友链
    │   ├── search/           # 全局搜索（fuse.js）
    │   ├── archives/ tags/ categories/  # 归档 / 标签 / 分类
    │   └── globals.css       # 设计令牌与全部动画类
    ├── components/
    │   ├── layout/           # Navbar / Footer / SiteShell（iPadOS 式侧边栏）
    │   ├── home/             # 首页组件：时钟 / 日历 / 音乐 / 随机文章 / 视频背景
    │   ├── post/             # PostDateList（时间轴）/ TOCSidebar / PostCard / LikeButton
    │   ├── mdx/              # MDX 自定义组件（Callout / CodeBlock）
    │   └── ui/               # ScrollReveal / ScrollToTop / TagBadge
    └── lib/
        ├── posts.ts          # 文章读取：getAllPosts / getPostBySlug / 标签与分类统计
        ├── share.ts          # 分享专栏静态数据（知识大类 × 多位作者）
        └── db/schema.ts      # drizzle 数据表定义（点赞等，预留）
```

## 核心功能

- **首页 Bento 布局**：导航卡 / 头像卡（三行欢迎语 + 按时段问候由客户端组件渲染）/ 横幅（压缩版 yantai-banner.jpg）/ 时钟 / 日历 / 最新文章 / 随机文章 / 音乐播放器 / 社交链接。
- **视频背景**：`VideoBg` 全屏固定播放 `public/videos` 视频，静音循环；叠加随主题变化的遮罩（浅色加白纱、深色加深纱）保证前景可读。
- **时间轴文章列表**：`PostDateList` 按日/周/月/年/分类切换视图，行样式为「日期 | 圆点 | 标题 | 标签」的毛玻璃时间轴，hover 行右移并高亮。
- **iPadOS 式侧边栏**：`SiteShell` 含浏览/分类/标签分区、计数徽标、选中态圆角高亮、可收起（`lg` 以上显示）。
- **滚动入场动画**：`ScrollReveal` 全局观察 `.reveal` / `.reveal-scale`；文章正文标题/代码块淡入放大、段落依次上移。通过 MutationObserver 接管客户端重渲染（列表切换）产生的新节点，防止内容停留不可见。
- **页面切换动画**：`next.config.ts` 开启 `experimental.viewTransition`，进入默认 iOS 缩放（ios-zoom），返回导航使用回退动画（nav-back → ios-back）。
- **分享专栏** **`/share`**：按知识大类（GPU/AI Infra、运维/CI-CD/监控、技术周刊/观点、编程语言/前端、效率工具/方法、独立博客精选）收录杜子源、二丫讲梵、阮一峰及博客圈 22 位博主的文章与专栏；顶部搜索框 + 分类 chips 客户端过滤 + 卡片网格（分类渐变封面 / 作者 / 类型标签）。
- **文章详情页**：MDX 渲染 + 目录 TOC（随滚动高亮）+ KaTeX 数学公式 + Shiki 代码高亮 + 阅读时间/字数统计 + 点赞（客户端）。

## 内容写作

在 `content/posts/` 下新建 `.mdx` 文件，slug 即相对该目录的路径。Frontmatter 字段：

```yaml
---
title: 文章标题
date: 2026-10-26
summary: 一句话摘要（列表与搜索使用）
tags: [tag1, tag2]
categories: [note, deep-learning]
draft: false   # true 时不对外展示
---
```

正文支持 GFM（表格/任务列表）、数学公式（`$...$` / `$$...$$`）与自定义组件（如 `Callout`）。`getAllPosts()` 会自动过滤 `draft` 并按日期倒序，同时统计标签/分类数量供侧边栏使用。

## 设计系统

设计令牌集中在 `src/app/globals.css`：

- **语义色**：`--color-brand`（品牌青绿）、`--color-primary / secondary / tertiary`、`--color-border`、`--color-card` 等，`.dark` 下自动切换深色值。
- **毛玻璃**：`.glass-card`（悬停上浮 + 品牌色描边）、`.glass-card-static`、`.navbar-glass`、`.article-surface`、`.squircle`（圆角方形）。
- **动画类**：`.reveal` / `.reveal-scale`（滚动入场）、`.page-fade-in`（首屏淡入）、`.timeline-track / .timeline-dot / .timeline-link`（时间轴列表）、`.press`（点击缩放）、iOS View Transition 键 `ios-zoom` / `ios-back`。

## 本地开发

```bash
npm install       # 安装依赖
npm run dev       # http://localhost:3000
npm run build     # 生产构建
npm start         # 运行生产服务
npm run lint      # ESLint
```

> 注意：本仓库使用经过定制的 Next.js（见 `node_modules/next/dist/docs/`），与公开文档存在 API 差异，改动前请先阅读对应指南。

## 部署

可直接部署到 Vercel（`next build` / `next start`），无需额外配置；静态资源走 `public/`，文章走本地文件系统。若启用点赞等数据库功能，需配置 Neon Postgres 连接与 drizzle 迁移。

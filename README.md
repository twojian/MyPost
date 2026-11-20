# Twojian Blog

个人技术博客 —— 记录可复用、可验证、可长期维护的知识（408 考研笔记、AI Infra、前端与工具链）。

设计语言：iPadOS 式毛玻璃、时间轴文章列表、滚动入场动画与 View Transition 页面切换。

## 技术栈

| 领域 | 选型 |
| --- | --- |
| 框架 | Next.js 16.2.9（App Router）· React 19.2.4 · TypeScript |
| 样式 | Tailwind CSS v4 · @tailwindcss/typography |
| 内容 | MDX（`next-mdx-remote` 渲染 + `gray-matter` 解析 frontmatter） |
| 代码高亮 | rehype-pretty-code + Shiki（Catppuccin Latte / Mocha 双主题） |
| 搜索 | fuse.js（客户端模糊搜索） |
| 图标 / 动效 | lucide-react · framer-motion · 原生 View Transitions |
| 其它运行时依赖 | date-fns · reading-time · github-slugger · next-themes · grab-favicon |
| 数据层（已预留） | drizzle-orm + drizzle-kit · @neondatabase/serverless · next-auth（beta）· bcryptjs |

## 目录结构

```
.
├── content/posts/                    # 文章内容（.mdx / .md），slug = 相对此目录的路径（去扩展名）
│   ├── articles/                     # 长文：研究方法、找方向、读论文等
│   ├── blog/                         # 408 操作系统单章随笔
│   ├── notes/
│   │   ├── 408/                      # 408 笔记：顶层散篇 + 代码小抄 / 操作系统 / 数据结构 /
│   │   │                             #   真题 / 计算机组成原理 / 计算机网络 六个子目录
│   │   ├── ai-infra/                 # AI Infra 笔记
│   │   ├── aigc/                     # AIGC 笔记（目录已建，暂无文章）
│   │   ├── deep-learning/            # 深度学习笔记
│   │   ├── html/                     # HTML / CSS / HTTP 速查
│   │   └── nlp/                      # NLP 笔记
│   └── tutorials/                    # 教程：n8n 入门与运维
├── public/
│   ├── images/                       # 头像 ayanami.jpg、横幅、视频海报、cursor.svg
│   ├── videos/                       # 首页全屏背景视频
│   ├── audio/                        # 音乐播放器音频
│   └── sparrow-matrix/               # 独立静态页，经 /Sparrow-General 重写访问
├── scripts/
│   ├── create-admin.mjs              # 后台管理员账号初始化
│   └── migrate-posts.mjs             # 历史文章批量迁移
├── drizzle/                          # SQL 迁移与元数据（0000_init.sql 等）
└── src/
    ├── app/                          # App Router
    │   ├── layout.tsx                # 全局布局（主题、字体、SiteShell）
    │   ├── page.tsx                  # 首页 Bento 布局
    │   ├── globals.css               # 设计令牌 + 全部动画类 + .prose-notion 正文样式
    │   ├── not-found.tsx             # 404 页
    │   ├── posts/page.tsx            # 文章列表（时间轴）
    │   ├── posts/[...slug]/page.tsx  # 文章详情（MDX 渲染 + TOC + 阅读时长 + 点赞）
    │   ├── archives/                 # 归档
    │   ├── tags/[tag]/               # 标签详情
    │   ├── categories/[category]/    # 分类详情
    │   ├── search/                   # 全局搜索（search/page.tsx + SearchClient.tsx）
    │   ├── share/                    # 分享专栏（share/page.tsx + ShareClient.tsx）
    │   ├── bloggers/                 # 博客圈友链
    │   ├── canirun/                  # 「能不能跑」模型 / 设备对照工具页
    │   └── api/favicon/route.ts      # 站点图标接口（服务端抓取 + 缓存）
    ├── components/
    │   ├── layout/                   # Navbar / Footer / SiteShell
    │   ├── home/                     # 首页：ClockWidget / CalendarWidget / MusicPlayer /
    │   │                             #   RandomPost / VideoBg / BentoTransition
    │   ├── post/                     # PostDateList / PostList / PostCard / PostMeta /
    │   │                             #   TOCSidebar / LikeButton
    │   ├── mdx/                      # MDX 渲染层：MDXComponents / Callout / CodeBlock /
    │   │                             #   Details / ExternalAnchor
    │   └── ui/                       # SiteIcon / ScrollReveal / ScrollToTop / TagBadge
    └── lib/
        ├── site-config.ts            # 站点配置单一来源（站名/域名/邮箱/GitHub）＋ mailtoHref
        ├── nav.ts                    # 导航配置单一来源（Navbar / SiteShell / 首页入口共用）
        ├── posts.ts                  # 文章读取：getAllPosts / getPostBySlug / isDirectorySlug /
        │                             #   getPostsByPrefix / 标签与分类统计
        ├── mdx-plugins.ts            # MDX 编译插件链唯一出口（remarkPlugins / rehypePlugins）
        ├── text-color.ts             # 文字颜色语法 `{red|文字}` 的源码级预处理
        ├── rehype-image-figure.ts    # 图片图注 rehype 插件（段落 → figure + figcaption）
        ├── category-meta.ts          # 分类的图标与配色
        ├── tag-meta.ts               # 标签配色（Catppuccin 双模式）
        ├── favicon.ts                # 站点图标自动匹配（grab-favicon + 缓存）
        ├── share.ts                  # 分享专栏静态数据（知识大类 × 多位作者）
        ├── fetch-share.ts            # 分享专栏外部源（RSS / Atom）抓取
        ├── utils.ts                  # 日期归一化等公共工具
        └── db/schema.ts              # drizzle 数据表定义（点赞等，预留）
```

## MDX 已支持能力

渲染链路集中在 `src/lib/mdx-plugins.ts`，正文样式集中在 `globals.css` 的 `.prose-notion`：

| 能力 | 写法 | 说明 |
| --- | --- | --- |
| 数学公式 | `$...$` / `$$...$$` | remark-math + rehype-katex（`strict: false`） |
| 代码高亮 | ```` ```lang ```` | rehype-pretty-code，Catppuccin Latte / Mocha 双主题，按需加载语法 |
| 记号笔高亮 | `==文字==` | remark-flexible-markers，CSS 变量着色，深浅色自动适配 |
| 文字颜色 | `{red\|文字}` | 源码级预处理（见 `text-color.ts`），支持 Catppuccin 14 色 + orange / purple / gray 别称 |
| 图注 | `![alt](src "图注")` | 带 title 的图片转为 figure + figcaption |
| 表格 / 任务列表 | GFM | remark-gfm，表格外包横向滚动容器 |
| 标题锚点 | 自动 | rehype-slug + rehype-autolink-headings（`heading-anchor`） |
| 内链 / 外链区分 | 自动 | `ExternalAnchor`：同域绝对地址、相对路径、`#` 锚点走 `next/link` 不新开窗；外链 `target=_blank` 加图标；`mailto:` / `tel:` 用原生 a |
| 自定义组件 | `<Callout>` / `<Details>` | 由 `MDXComponents` 注册，可直接在正文使用 |

> `{red|文字}` 不是合法 JS 表达式，MDX parse 阶段会报错，因此必须在交给 MDXRemote 之前做源码级替换；`text-color.ts` 会先屏蔽围栏代码块、行内代码与公式区域，不会误伤。

## 内容写作

在 `content/posts/` 下新建 `.mdx`（或 `.md`），slug 即相对该目录的路径，支持中文目录与中文 slug，也支持多级目录。Frontmatter：

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

`getAllPosts()` 递归读取并过滤 `draft`、按日期倒序，同时统计标签 / 分类数量供侧边栏使用；`getPostBySlug()` 对不存在的 slug 调用 `notFound()` 返回 404；`isDirectorySlug()` 命中目录时渲染目录下的文章列表。

## 设计系统

设计令牌集中在 `src/app/globals.css`：

- **语义色**：`--color-brand`（品牌青绿）、`--color-primary / secondary / tertiary`、`--color-border`、`--color-card` 等，`.dark` 下自动切换。
- **Catppuccin 变量**：`--ctp-*` 在 `:root`（Latte）与 `.dark`（Mocha）各一套，供标签色与文字颜色语法使用。
- **毛玻璃**：`.glass-card`、`.glass-card-static`、`.navbar-glass`、`.article-surface`、`.squircle`。
- **动画类**：`.reveal` / `.reveal-scale`（滚动入场）、`.page-fade-in`、`.timeline-track / .timeline-dot / .timeline-link`、`.press`，以及 View Transition 键 `ios-zoom` / `ios-back`。

## 本地开发

```bash
npm install
npm run dev     # 默认 Turbopack，http://localhost:3000
npm run build   # 生产构建
npm start       # 运行生产构建
npm run lint    # ESLint（eslint CLI，非 next lint）
```

**关于 `dev` 需要 `--webpack`**：当前开发机项目路径含中文（`C:\Users\健\...`），Turbopack 在重建 `.next` 缓存时会误判 `globals.css` 中的 CSS 变量（`var(--color-hairline)` 被错码），导致样式解析报错。项目路径含中文时请用：

```bash
npm run dev -- --webpack -p 3000   # 中文路径下的临时规避方案
```

路径为纯英文时可直接 `npm run dev`。彻底解决需等 Turbopack 修复中文路径问题，或把项目迁到纯英文路径。

## 部署

部署在 Vercel，`next build` 产物直出，无需额外配置：文章来自仓库内 `content/posts` 的文件系统读取，静态资源走 `public/`，`next.config.ts` 里把 `/Sparrow-General` 重写到 `public/sparrow-matrix/index.html`，`experimental.viewTransition` 提供页面切换动画。若启用点赞等数据库功能，需配置 Neon Postgres 连接并执行 `drizzle/` 下的迁移。

## 已知限制

- **Turbopack 中文路径**：如上，中文路径下需回退 `--webpack`。
- **搜索在前端**：fuse.js 在客户端加载索引，文章量继续增长后需考虑服务端检索或分片。
- **数据层未启用**：`src/lib/db/schema.ts`、`drizzle/`、`scripts/create-admin.mjs` 均为预留，站点当前不依赖数据库即可完整运行。
- **`canirun` 页依赖本地服务**：页面内嵌 `http://localhost:4321` 的外部工具，未启动该服务时该页不可用。
- **分享专栏数据半静态**：主体来自 `share.ts`，外部源由 `fetch-share.ts` 抓取 RSS / Atom，抓取失败时该部分为空。
- **项目定制 Next.js**：本仓库使用经过定制的 Next.js（`node_modules/next/dist/docs/`），与公开文档存在 API 差异，改动前请先阅读对应指南。

## 配置约定

- 站名、域名、邮箱、GitHub 等跨页面取值统一在 `src/lib/site-config.ts` 维护，组件从 `siteConfig` / `mailtoHref` 引用，**禁止在 JSX 里写死字面量**。
- 导航入口统一在 `src/lib/nav.ts`，分类 / 标签的图标与配色分别在 `category-meta.ts` / `tag-meta.ts`。
- 正文编译插件链唯一出口是 `src/lib/mdx-plugins.ts`，调整顺序前先看文件头注释里的依赖约束。

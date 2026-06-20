# Roadmap

## Phase 1 — 基础搭建（当前）

- [x] 项目初始化（Next.js + Tailwind + MDX）
- [x] 首页布局（Hero, Calendar, Music, Clock）
- [x] 文章系统（列表、详情、MDX 渲染）
- [x] 标签 / 分类 / 归档页面
- [x] 搜索功能（Fuse.js）
- [x] 侧边栏 / 导航栏 / Footer
- [x] **提交初始代码到 GitHub**
- [x] **部署到 Vercel**

## Phase 2 — 完善体验

- [ ] 响应式优化（移动端适配）
- [ ] SEO 优化（meta tags, Open Graph, sitemap.xml）
- [ ] RSS 订阅（/feed.xml）
- [ ] 文章目录高亮（TOC 滚动跟踪）
- [ ] 图片懒加载 + 图片灯箱
- [ ] 404 页面美化
- [ ] Loading / Skeleton 骨架屏

## Phase 3 — 功能增强

- [ ] 评论系统（Giscus / Waline）
- [ ] 阅读量统计
- [ ] 文章系列/专栏导航
- [ ] 友链页面数据化（JSON 驱动）
- [ ] 分享页面内容填充
- [ ] KaTeX 数学公式暗色适配
- [ ] 代码块一键复制优化

## Phase 4 — 进阶

- [ ] 国际化（i18n）
- [ ] PWA 离线访问
- [ ] 文章全文搜索（Algolia / Pagefind）
- [ ] 自动化部署流水线（GitHub Actions）
- [ ] 性能监控（Web Vitals）
- [ ] 内容 CMS 集成（Notion API / Contentlayer）

## 提交计划（Phase 1 收尾）

初始代码按模块分批提交，每个 commit 对应一个 PR，保持历史清晰：

| #  | Commit Message                                             | PR 标题                                       | 关键文件                                                             |
| -- | ---------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| 1  | `chore: project setup and dependencies`                    | `[chore] 项目初始化，配置 Next.js + Tailwind + MDX` | `package.json`, `next.config.ts`, `globals.css`                  |
| 2  | `feat(layout): add Navbar, Footer, and Sidebar`            | `[feat] 新增导航栏、页脚和侧边栏布局组件`                   | `src/components/layout/*`                                        |
| 3  | `feat(home): add hero, calendar, music, and clock widgets` | `[feat] 新增首页 Hero、日历、音乐播放器和时钟组件`            | `src/components/home/*`                                          |
| 4  | `feat(posts): add post list, detail, and MDX rendering`    | `[feat] 新增文章列表、详情页和 MDX 渲染系统`               | `src/app/posts/*`, `src/components/post/*`, `src/lib/posts.ts`   |
| 5  | `feat(tags): add tag and category pages`                   | `[feat] 新增标签和分类筛选页面`                        | `src/app/tags/*`, `src/app/categories/*`                         |
| 6  | `feat(search): add client-side fuzzy search`               | `[feat] 新增客户端模糊搜索功能`                        | `src/app/search/*`                                               |
| 7  | `feat(archives): add archive page`                         | `[feat] 新增文章归档页面`                           | `src/app/archives/*`                                             |
| 8  | `feat: add bloggers, share, and 404 pages`                 | `[feat] 新增友链、分享和 404 页面`                    | `src/app/bloggers/*`, `src/app/share/*`, `src/app/not-found.tsx` |
| 9  | `content: add initial blog posts`                          | `[content] 添加初始博客文章（教程/笔记/随笔）`              | `content/posts/**`                                               |
| 10 | `docs: add commit convention, PR template, and roadmap`    | `[docs] 新增提交规范、PR 模板和项目路线图`                 | `.github/*`                                                      |


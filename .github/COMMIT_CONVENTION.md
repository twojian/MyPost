# Git Commit & PR Convention

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## Commit 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

## PR 标题格式

```
[type] 一句话说明本 PR 新增/修改了什么
```

示例：
```
[feat] 新增客户端模糊搜索功能，支持标题和标签匹配
[fix]  修复首页在移动端布局错位的问题
[docs] 更新 README 中的本地运行步骤
```

## Type 类型

| Type       | 说明                         | 示例                                      |
| ---------- | ---------------------------- | ----------------------------------------- |
| `feat`     | 新功能                       | `feat(search): add fuzzy search`          |
| `fix`      | 修复 Bug                     | `fix(mdx): fix code block overflow`       |
| `docs`     | 仅文档变更                   | `docs: add deployment guide`              |
| `style`    | 代码格式（不影响逻辑）       | `style: fix indentation in Sidebar`       |
| `refactor` | 重构（非新功能、非修复）     | `refactor(posts): extract PostCard logic` |
| `perf`     | 性能优化                     | `perf: lazy load images`                  |
| `test`     | 添加/修改测试                | `test: add PostCard unit test`            |
| `chore`    | 构建/工具/依赖变更           | `chore: upgrade next to 16.3`             |
| `ci`       | CI/CD 配置变更               | `ci: add Vercel preview deploy`           |
| `content`  | 博客内容（文章增删改）       | `content: add deep-learning notes`        |

## Scope 作用域（可选）

| Scope        | 覆盖范围                            |
| ------------ | ----------------------------------- |
| `home`       | 首页组件（Hero, Calendar, Music）   |
| `posts`      | 文章页面与文章组件                  |
| `search`     | 搜索功能                            |
| `layout`     | Navbar, Footer, Sidebar             |
| `mdx`        | MDX 渲染相关                        |
| `tags`       | 标签系统                            |
| `categories` | 分类系统                            |
| `archives`   | 归档页面                            |
| `config`     | 配置文件（next.config 等）          |
| `deps`       | 依赖变更                            |

## 规则

1. **subject** 使用英文，首字母小写，不加句号，祈使语气
2. **body** 可选，说明 why 而不是 what
3. **Breaking Change** 在 footer 加 `BREAKING CHANGE:` 前缀
4. 每次提交只做一件事，保持原子性

## 示例

```
feat(search): add fuzzy search with Fuse.js

Implement client-side full-text search using Fuse.js.
Supports title, content, and tag matching.
```

```
content: add n8n beginner guide

New tutorial series for n8n workflow automation.
```

```
fix(mdx): fix KaTeX rendering in dark mode

KaTeX formulas were invisible in dark mode due to
missing color variable override.
```

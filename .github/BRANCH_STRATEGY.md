# Branch Strategy

## 分支模型

```
main          ← 生产分支，Vercel 自动部署
  └── dev     ← 开发主线，功能合并到这里
       ├── feat/xxx    ← 新功能分支
       ├── fix/xxx     ← Bug 修复分支
       ├── content/xxx ← 博客内容分支
       └── refactor/xxx
```

## 规则

1. **`main`** — 始终可部署，只接受来自 `dev` 的 PR
2. **`dev`** — 日常开发合并目标
3. **功能分支** — 从 `dev` 切出，完成后 PR 回 `dev`
4. 分支命名：`<type>/<short-description>`，如 `feat/dark-mode`、`content/add-nlp-notes`
5. 合并方式：**Squash Merge**（保持 main/dev 历史干净）

## 示例流程

```bash
git checkout dev
git pull origin dev
git checkout -b feat/rss-feed
# ... 开发 ...
git push -u origin feat/rss-feed
# 在 GitHub 创建 PR → dev
# Review & Squash Merge
```

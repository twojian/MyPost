---
title: "n8n 维护运维手册（Docker Compose 方案）"
date: 2026-01-12
draft: false
tags: ["n8n", "Docker", "运维"]
categories: ["工程实践"]
---

## 1. 当前部署结构说明

- 运行方式：Docker Desktop + docker compose
- 容器名：n8n
- 数据目录：n8n_data
- 端口：5678

所有状态数据均保存在数据目录中。

## 2. 日常运维命令

启动 / 恢复：

```bash
docker compose up -d
```
停止服务：

```
docker compose down
```
查看日志：
```
docker logs n8n
```
3. 安全升级流程
```
docker compose pull
docker compose up -d
```

> **升级过程中应避免中断 migration。

4. 备份与恢复策略

备份整个数据目录：
```
n8n_data/
```

恢复步骤：

停止容器

恢复数据目录

重新启动服务

5. 常见故障排查

页面无法访问：

容器是否运行

是否存在 Paused 状态

端口是否冲突

工作流未触发：

是否已 Activate

Trigger 是否正确

6. 运维禁忌

不使用 Docker Pause

不混用 docker run 与 compose

不在容器内手动修改数据文件

7. 架构演进方向

执行量增大：引入 Postgres

公网访问：反向代理 + HTTPS

AI / Python 任务：外置 Task Runner

---

## 五、为什么这个结构是“对的”

从 Hugo 的角度看：

- `_index.md` 负责“系列语义”
- 单篇文章职责清晰
- 未来你可以无缝追加：
  - `n8n-webhook.md`
  - `n8n-postgres.md`
  - `n8n-ai-agent.md`

从工程角度看：

> **这是把一次成功部署，转化为可长期复用的系统经验。**

---

如果你愿意，下一步我可以帮你做三件更“高阶”的事之一：

1. 帮你写 **README 风格的总结版**
2. 帮你做 **Hugo 目录页的内容增强（toc / 卡片）**
3. 把这一套升级成 **“n8n 实践系列”长期专栏规划**

你现在已经不是在“记笔记”，而是在**沉淀工程能力**。

---
title: "n8n 新手使用手册（Docker Desktop 本地环境）"
date: 2026-01-12
draft: false
tags: ["n8n", "自动化"]
categories: ["工程实践"]
---

## 1. 访问方式与基本概念

在浏览器中访问：

http://localhost:5678

这是 n8n 的 Editor UI，用于创建和管理工作流。

n8n 的核心不是脚本，而是**事件驱动的工作流引擎**：

- Workflow：工作流（有向图）
- Node：节点（执行单元）
- Trigger：触发器（入口）
- Execution：一次执行实例

## 2. 第一个工作流的正确打开方式

推荐从 `Manual Trigger` 开始，目的不是“做事”，而是确认：

- 执行链路正常
- Execution 能生成
- 输入输出可追踪

## 3. 激活（Activate）的意义

未激活的工作流：

- 只能手动执行
- Webhook / Cron 不生效

已激活的工作流：

- 自动响应事件
- 进入“生产态”

这是新手最容易忽略的一步。

## 4. Credentials 使用规范

Credentials 是全局资源，工作流只引用，不存储密钥。

建议：

- 统一命名
- 避免在 Function 节点中硬编码密钥
- 删除前确认依赖关系

## 5. Execution 与调试思路

每一次执行都会生成 Execution 记录：

- 可查看每个节点的输入输出
- 是排错的第一现场

调试优先顺序应始终是：

Execution → 节点 → 数据 → 逻辑

## 6. 新手阶段的使用边界

当前本地 Docker 架构非常适合：

- Webhook 自动化
- API 编排
- 定时任务
- AI API 调用

暂不建议用于高并发公网服务。

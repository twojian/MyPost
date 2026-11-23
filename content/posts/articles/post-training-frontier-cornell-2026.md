---
title: "开源大模型后训练的前沿难题：Cornell 2026 演讲全译"
date: 2026-11-23
summary: "Nathan Lambert（Trillium Labs）16 页演讲精译：后训练配方四代演进、算力分配反转、产业分工与六大开放难题。"
categories: ["训练与调优"]
tags:
  - "后训练"
  - "强化学习"
  - "开源模型"
  - "演讲笔记"
---

﻿
# 开源大模型后训练的前沿难题

> **Pushing Frontiers in Open Language Model Post-Training**

| 项目 | 内容 |
|---|---|
| 演讲者 | Nathan Lambert · Trillium Labs 执行董事 |
| 背景 | 原 Allen AI (Ai2) 核心研究员 / Tülu 3 与 OLMo 主导者 ·《Interconnects》作者 |
| 场合 | Cornell University 主题演讲 |
| 时间 | 2026 年 11 月 20 日 |
| 版本 | ABCI 精译 · 共 16 页 |
| 图表来源 | 演讲原图 IMG_7634 – IMG_7649 中裁切的图形，见文内配图 |

---

## 目录

- 开篇定调
- 配方演进
- 三代架构对照
- 算力分配反转
- 单模型 RL / 预训练算力比
- 开源 Base 模型矩阵
- 后后训练与产业新分工
- TMax 与 CLM
- 开放难题 #1 · Harness 与上下文
- 开放难题 #2 · Character Training
- 开放难题 #3 · RL 环境与数据池
- 开放难题 #4（上）· RL 效率与 CoT
- 开放难题 #4（下）· Never Give Up
- 开放难题 #5 · RL Scaling Laws
- 开放难题 #6 · Multi-Agent Scaling
- 收尾反思 · RSI 与科研边界

---

## 01 / 16 · 开篇定调｜开源大模型后训练的前沿难题

**CORNELL UNIVERSITY · 2026.11.20**

> **Pushing Frontiers in Open Language Model Post-Training**

**SPEAKER & CONTEXT**

- Nathan Lambert · Trillium Labs 执行董事
- 原 Allen AI (Ai2) 核心研究员 / Tülu 3 与 OLMo 主导者 ·《Interconnects》作者
- Cornell University 主题演讲 · 2026 年 11 月 20 日

---

### 判断 ① · 规模门槛 (Scale)

**前沿后训练正在重演 2023 年预训练的高门槛**

完整的前沿后训练（Post-training）正在像 2023 年初的预训练一样变得高不可攀。算力、长序列采样与多阶段工程成本持续拉高，小团队很难从零复现完整流程。

### 判断 ② · 研究空白 (Lack of Coverage)

**未来 5 年以上的开源文献存在大量空白**

过去一年后训练配方变化很快，工业界靠集群堆算力跳过了许多基础问题，反而为学术界与开源社区留出清晰且长期的研究空间。

---

### 关键数字

| 指标 | 数值 | 说明 |
|---|---|---|
| 前沿集群 RL 算力占比 | **55%** | 4Q26E |
| 主力开源实验室已停发裸 Base | **8 / 12** | 12 家中美实验室矩阵 |
| 开放课题 | **6 大** | 从低算力到百卡级 |

---

### 示意图：双向缩放定律 · o1 AIME 准确率趋势

![图 01-1　双向缩放定律 · o1 AIME 准确率趋势](/images/post-training-cornell-2026/fig01_double_scaling_law.png)

*图 01-1　双向缩放定律 · o1 AIME 准确率趋势（自原图裁切）*

OpenAI o1 证明后训练存在 **Train-time RL** 与 **Test-time 思考** 两套正交的算力扩展轴。

- 纵轴：AIME 数学竞赛型准确率（0% → 100%）
- 横轴：对数算力投入（Log Scale，低算力 → 高算力）
- 曲线 1：Train-time RL 训练算力曲线
- 曲线 2：Test-time 思考推理算力曲线

---

**演讲主旨：** 把前沿实验室藏在集群算力与工程流程背后的后训练方法，拆解为开源社区可验证、可跟进的研究问题。

---

## 02 / 16 · PART 1 · 后训练格局 · 配方演进｜过去一年的后训练配方变化，超过此前三年总和

**RECIPES EVOLUTION · 2022-2026**

从 SFT / RLHF / RLVR 三段基础闭环，演进到 2026 年多领域专家分训与在策略融合。

---

### 一、后训练三大优化方法与核心闭环

![图 02-1　后训练三大优化方法与核心闭环](/images/post-training-cornell-2026/fig02_three_methods_loop.png)

*图 02-1　后训练三大优化方法与核心闭环（自原图裁切）*

**INPUT｜Base 预训练基座**
掌握语言规律与世界知识，但尚不能按指令稳定交互。目标：预训练基座 → 对齐与推理成品。

**① SFT 监督微调 —— 学会对话格式与指令遵循**
用高质量示范问答拟合标准输出分布，确立基础行为模板。

**② 偏好微调（RLHF / DPO）—— 对齐人类主观偏好与安全**
通过成对偏好数据或奖励模型，教模型区分回答质量与边界。

**③ RLVR 可验证奖励 RL —— 客观验真激发长程推理**
在数学、代码单测与沙盒中用客观对错打分，驱动自我纠错。

---

### 二、四年四代配方演进：一年变化超过前三年

![图 02-2　四年四代配方演进](/images/post-training-cornell-2026/fig03_four_year_recipe.png)

*图 02-2　四年四代配方演进（自原图裁切）*

从单线聊天对齐 → 垂直专家分域与融合。

| 代际 | 代表模型 | 核心做法 | 主要表现 / 关键变化 |
|---|---|---|---|
| **2022~23 · GEN 1** | **InstructGPT**<br>SFT → RM → PPO | 确立现代对话模型三步串联流程，以人类示范和主观打分为核心 | 局限：偏重礼貌与安全遵循，缺乏多步验证推理能力 |
| **2024 · GEN 2** | **Llama 3 / Tülu 3**<br>多阶段混合 + RLVR | SFT 与偏好微调数据管线工程化成熟，开源界首次系统引入 RLVR | 关键变化：沉淀出开源社区可完整复现的多阶段后训练配方 |
| **2025 · GEN 3** | **DeepSeek R1**<br>大规模推理 RL | 证明大规模纯 GRPO 可自发涌现反思、检验、回溯与长思维链 | 关键变化：推理 RL 正式成为算力占比最高的独立训练阶段 |
| **2026 · GEN 4** | **MiMo-V2-Flash**<br>专家分训 → 在线融合 | 先分域训练 N 个垂直领域专家，再通过多教师在策略蒸馏（MOPD）融回单一模型 | 当前主流：DeepSeek V4、Nemotron 3 Ultra 与最新 GPT 均已采纳 |

---

**演进主线：** 后训练已从「单一模型依次对齐」，转为「共享底座 → 垂直专家 RL → 多教师在策略蒸馏融回单一模型」。

---

## 03 / 16 · PART 1 · 后训练格局 · 三代架构对照｜为什么全行业正在转向 2026 MOPD

**ARCHITECTURE · MOPD DEEP DIVE**

不再把所有奖励混入同一个 RL 流程：先分域练好独立专家，再通过「在策略蒸馏」融回单一模型。

---

### 2022-23 · 第一代｜InstructGPT · 单线串行流水线

![图 03-1　第一代 InstructGPT 单线串行流水线](/images/post-training-cornell-2026/fig04_gen1_instructgpt.png)

*图 03-1　第一代 InstructGPT 单线串行流水线（自原图裁切）*

预训练基座 → **1. 人工示范 SFT**（指令微调初始策略）→ **2. 奖励模型（RM）**（人类成对偏好排序打分）→ **3. PPO 强化学习**（KL 约束下优化策略）

---

### 2025 · 第二代｜DeepSeek R1 · 多步思维推理 16 步

![图 03-2　第二代 DeepSeek R1 双路线](/images/post-training-cornell-2026/fig05_gen2_deepseek_r1.png)

*图 03-2　第二代 DeepSeek R1 双路线（自原图裁切）*

1. **冷启动 SFT** —— 可读性、格式规范
2. **推理导向 RL** —— 数学 / 代码能力提升
3. **拒绝样本 SFT + 多场景 RL** —— 将推理力迁移至写作、安全与通用对话

**完整 16 步训练**

**R1-Zero 路线**：跳过 SFT 冷启动，基座直接跑大规模纯 GRPO（可验证奖励），自发涌现长思考、自我检验与回溯（但输出语言混杂、可读性较弱）。

版本标注：2.6 · DeepSeek R1.5；3.11 · Mixtral 8x22B。

---

### 2026 · 第三代主流｜MOPD · 多教师在策略蒸馏

![图 03-3　第三代 MOPD 多教师在策略蒸馏](/images/post-training-cornell-2026/fig06_gen3_mopd.png)

*图 03-3　第三代 MOPD 多教师在策略蒸馏（自原图裁切）*

**Multi-teacher On-Policy Distillation**

- **STAGE 1｜共享 SFT / 推理底座**
  统一路线检查点

- **STAGE 2｜训练 N 个独立领域专家（各自独立 SFT + RL）**
  - 数学 / 形式化推理专家 Teacher
  - 软件工程 / 代码专家 Teacher
  - 多模态 / 图像专家 Teacher
  - 通用写作 / 安全专家 Teacher

- **STAGE 3｜在策略蒸馏（融回单一 Student 模型）**
  1. Student 自己实时采样轨迹
  2. 按领域对应 Teacher 对齐 logits，减少任务奖励冲突，稳定收敛

**Mimo-V2-Flash 首创**；DeepSeek-V4 · Nemotron 3 Ultra · Gini 3 20K · 最新 GPT 均已采纳。

---

## 04 / 16 · PART 1 · 后训练格局 · 算力分配反转｜Post-training 占比两年从 ~5% 升至 55%

**COMPUTE SHIFT · SEMIANALYSIS**

SemiAnalysis 追踪显示：OpenAI 与 Anthropic 的集群重心已从「算力容量受限的预训练」转向「显存带宽受限的 RL 训练」。

---

### Anthropic + OpenAI 合计集群算力占比

![图 04-1　Anthropic + OpenAI 合计集群算力占比](/images/post-training-cornell-2026/fig07_compute_share_bar.png)

*图 04-1　Anthropic + OpenAI 合计集群算力占比（自原图裁切）*

**Post-training / RL：~5% → 55%，成为算力主力**

从 1Q24 仅 ~5%、2Q25 的 14%，在 4Q25 反超预训练至 36%，2Q26 过半（50%），4Q26E 预计达到 55%。该阶段以自回归长序列采样为主，受显存带宽制约。

**Pre-training：67% → 7%，占比大幅缩减**

主要受算力容量（Capacity-bound）制约的预训练，从 1Q24 的 67% 降至 4Q26E 的个位数 7%，仅靠继续堆预训练规模已难拉出代差。

**Inference：29%–39%，占比保持平稳**

4Q26E 线上推理预计占 38%，这意味着后训练与推理合计将占前沿集群 67%~94% 的算力资源。

---

### 注释

1. 1Q24 至 1Q25 时间段内，RL 占比数据缺失（非 0%），实际占比极低。
2. 2025Q2 时 RL 占比为 21%（Pre-training 与 Inference 存在其他估算）；4Q25 起 RL 首次反超 Pre-training；Inference 全周期在 29%–39% 区间。

---

## 05 / 16 · PART 1 · 后训练格局 · 单模型 RL / 预训练算力比｜从 5% 升至 4 倍

**SINGLE-MODEL COMPUTE RATIO**

DeepSeek R1（2025.01）、Beam（2026.10）与 Inkling 2 Small（2026.11）账单实测。

| 代表模型 | 发布时间 | 参数规模（总 / 激活） | Pre-training 算力 | Post-training RL 算力 | RL / 预训练 |
|---|---|---|---|---|---|
| DeepSeek R1 | 2025.01 | 671B / 37B active | 2.66M H800 GPUh | 0.14M H800 GPUh | **~5%** |
| Beam | 2026.10 | 501B / 23B active | &lt;4.1M（~1,055 GB300 集群 &lt;1 周） | ~7.1M（10.5K GB300 4 周） | **>1.7x** |
| Inkling 2 Small | 2026.11 | 594B / 17B active | &lt;0.11M\*（~1,500 GPUs &lt;5 天） | ~0.44M（2,048 GPUs 9 天） | **~4x\*** |

---

### RL 相比预训练 GPU-hours 倍数对比（以 Pre-training = 1.0x 为基准）

![图 05-1　RL 相对预训练 GPU-hours 倍数对比](/images/post-training-cornell-2026/fig08_rl_pretrain_ratio.png)

*图 05-1　RL 相对预训练 GPU-hours 倍数对比（自原图裁切）*

| 模型 | 算力对比 | 倍数 |
|---|---|---|
| DeepSeek R1（2025.01）671B / 37B active | 2.66M vs 0.14M GPUh | ~0.05x（RL 占预训练 ~5%） |
| Beam（2026.10）501B / 23B active | &lt;4.1M vs ~7.1M GPUh | >1.7x（1,055 GB300 集群持续跑 4 周） |
| Inkling 2 Small（2026.11）594B / 17B active | &lt;0.11M vs ~0.44M GPUh | ~4x\*（2,048 GPUs 跑 9 天 RL） |

---

### 重要口径说明

在 RL 阶段大量 GPU 时间消耗在自回归采样（Rollout）而非稠密矩阵乘上，因此其实际 FLOPS 占比仍低于 GPU-hours 占比；Inkling 2 Small 预训练极短（&lt;3 天），体现「高复用基座 + 长周期 RL」的新算力配比。

---

## 06 / 16 · PART 2 · 产业分工 · 开源 Base 模型矩阵｜开源 Base 模型正在消失：12 家中美实验室矩阵

**AS OF 2026.11.19 · 12 LABS**

截至 2026 年 11 月 19 日：三分之二的主力开源实验室已不再发布裸 Base 权重。

---

### 仍发布完整 Base（4 家）｜33%

| 实验室 | 模型线 | 具体版本 |
|---|---|---|
| Google Gemma | Gemma | Gemma 4 12B |
| IBM Granite | Granite | Granite 4.2 |
| NVIDIA Nemotron | Nemotron | Nemotron 3 / Ultra 3 / 3.5 |
| Ant Ling（蚂蚁百灵） | Ling | Ling-2.6-1T / 3.0 |

---

### 近期 6 个月转向：仅发 Post-Trained 成品（8 家）｜67%

**西方实验室（2 家）**

| 实验室 | 模型线 | 状态 |
|---|---|---|
| Meta | Muse / Spark / Glimmer | 未开源 Base |
| Mistral | Large 4 | 未开源 Base |

**中国实验室（6 家）**

| 实验室 | 模型线 | 状态 |
|---|---|---|
| Alibaba Qwen | Qwen 3.8 | 未开源 Base |
| DeepSeek | DeepSeek-V4.1-Flash | 未开源 Base |
| MiniMax | MiniMax | 未开源 Base |
| Moonshot Kimi | K3 / K3.1 Pro | 未开源 Base |
| Xiaomi MiMo | Xiaomi MiMo V2.6 Pro / Flash | 未开源 Base |
| Z.ai GLM | GLM-5.2 / 5.3 / Flash X-Z | 未开源 Base |

在这 4 家仍发布裸预训练权重的企业，供学术界做从零起步的 SFT / RL 对照实验。中国 6 家主力与 Meta、Mistral 近半年均把预训练与多轮 RL 打包为成品权重交付。

---

### 为什么大家都不发 Base 了？

**1. Mid-training 模糊了 Base 边界**
中期训练阶段已混入大量推理轨迹与工具使用数据，纯粹意义上的「裸 Base 模型」越来越难定义。

**2. 防止泄权重，守住生态归属**
直接放出裸 Base 容易被竞品洗换权重或低成本复刻；直接发布成品模型更能绑定开发者生态与技术口碑。

**3. 完整后训练年门槛已达 ~$50M+**
从零通跑千卡级 RL 与多教师管线门槛太高，99% 的下游团队只需要在成品模型上做二次适配。

---

## 07 / 16 · PART 2 · 产业分工 · 后后训练与产业新分工｜从后训练到「后后训练」

**POST-PRISTINE TRAINING · HARVEY & MERCOR**

当从零基础开始前沿后训练，年化成本达到 $50M+ / 年，基于开源强推理成品的二次适配成为主流。

---

**成本分界线：~$50M+ / 年**

从零基础开始前沿后训练（含千卡 / 万卡 RL 采样集群与多教师管线），少数大厂之外难以独立承担。

**新兴环节｜Post-post-training（后后训练）**

不再从零 Base 起步，而是站在已训练优化过的顶层开源推理模型之上，针对特定行业的私有环境、工作流 Harness 与推理成本效率做二次强化学习与适配。

---

### 案例 ①：Harvey Tenet · 2026.08 · 法律垂直适配

法律 AI 平台 Harvey 基于开源 Kimi K3，联合 Fireworks 平台执行法律垂直后训练；在相同推理成本下，Legal Agent Bench 保留集全通过率（all-pass rate）达到原版 Kimi K3 的近 2 倍。

### 案例 ②：Mercor + SkyRL · 2026.09 · 开源全套配方

专家人才认证平台 Mercor 联合开源强化学习框架 SkyRL，使用高壁垒行业专家数据对 Qwen3.5-397B-A7B 做 RL 后后训练，并完整开源了训练脚本与权重。

---

### Legal Agent Bench 保留集 All-Pass Rate（同成本对比）

![图 07-1　Legal Agent Bench 保留集 All-Pass Rate（同成本对比）](/images/post-training-cornell-2026/fig09_legal_agent_bench.png)

*图 07-1　Legal Agent Bench 保留集 All-Pass Rate（同成本对比）（自原图裁切）*

- Kimi K3 原版：**1.0x（基准）**
- Harvey Tenet：**~2.0x**

> 垂直企业不需要自研预训练，也能在核心业务指标上比同业成本通过率翻倍。

**为什么可行：**

1. **开源基座能力足够强** —— Qwen3.5-397B-A7B 已具备扎实的基础推理与代码能力，无需从头重练底层。
2. **领域专家数据难以替代** —— 由行业专家构造的长尾评测与任务环境，通用实验室既买不到也难覆盖。
3. **训练成本可控且可复现** —— 直接在 SkyRL 上跑垂直领域 RL，省去前面完整的 SFT 与多教师蒸馏流水线。

---

## 08 / 16 · PART 2 · 产业分工 · TMax 与 CLM｜后后训练开源实例、两年一跳的周期

**TMAX-CLM · 2-YEAR PARADIGM CYCLE**

Lambert 团队两条低算力开源路线：用可验证沙盒提炼小模型，放在线上 RL 让模型管理上下文。

---

### TMax：小尺寸终端 Agent RL 配方（2B-27B 开源 Qwen）

针对命令行与系统运维任务，设计九轴任务空间组合自动生成 Docker 沙盒与单元测试环境，并通过审计与自动修复过滤噪声数据，让中小尺寸模型稳定学会真实排障。

- STEP 1　九轴任务设计
- STEP 2　Docker / 单测生成
- STEP 3　审计与自动修复

> **实测结果：** 干净可验证的沙盒环境让 2B-27B 开源 Qwen 在 Terminal-Bench 取得领先表现。

---

### CLM：模型自编辑上下文（Qwen3.5-9B 在线 RL）

Context Language Models (CLM) 在 Qwen3.5-9B 上运行在线强化学习，让模型绕过外部固定的记忆管理脚本，直接自己读写、重写并精简上下文文件，把上下文控制权交还给策略本身。

- STEP 1　读取上下文文件
- STEP 2　在线 RL 策略决策
- STEP 3　直接改写精简

> **实测结果：** 将「如何保留信息」放进 RL 动作空间，同步改善垂直任务专精化与 KV cache 效率。

---

### 后训练主路线：大约每两年一次代际切换

![图 08-1　后训练主路线时间轴](/images/post-training-cornell-2026/fig12_posttrain_roadmap.png)

*图 08-1　后训练主路线时间轴（自原图裁切）*

| 时间 | 路线 | 关键特征 |
|---|---|---|
| 2022-23 | RLHF / DPO | 基础对齐；聊天交互普及 |
| 2024-25 | RLVR / 工具使用 | 可验证奖励；推理与代码 Agent |
| 2026-27 | On-policy Distillation | MOPD 回归；自蒸馏与后后训练 |
| 2028 | ……? | 由以下 3 大开放难题决定 |

---

## 09 / 16 · PART 3 · 开放难题 #1 · Harness 专精化与上下文设计

**OPEN PROBLEM #1 · HARNESS & CONTEXT**

算力门槛最低的研究切入点：让模型自己学会管理上下文与专用工具，而非仅靠外部脚本拼接。

---

**切入契机：低成本且易复现**

大厂不会做所有垂直 Harness。大型实验室优先覆盖高 ARR 的通用编程与办公场景；科学计算、生物医药、跨学科实验等长尾领域商业回报有限，却高度依赖定制化的上下文工程与工具脚手架。

---

### 三大核心研究问题

1. **新交互抽象** —— 重新设计模型与持久记忆（Memory）、外部文件系统及专家工具的耦合接口。
2. **推理成本与缓存** —— 上下文膨胀会大幅拉低 KV cache 命中率；如何让模型在推理途中主动缩压冗余上下文？
3. **联合 RL 优化** —— 不把 Prompt 与 Harness 当作外部静态配置，而是纳入 RL 策略内部联合训练。

---

### 做法对比：传统外部脚本 vs CLM 自编辑上下文

![图 09-1　传统外部脚本方式](/images/post-training-cornell-2026/fig13_traditional_harness.png)

*图 09-1　传统外部脚本方式（自原图裁切）*

![图 09-2　CLM 自编辑上下文方案](/images/post-training-cornell-2026/fig14_clm_context.png)

*图 09-2　CLM 自编辑上下文方案（自原图裁切）*

**传统方式：模型被动接受外部规则预装的上下文**

- LLM 策略：只负责生成回答
- 外部硬编码 Harness 脚本
- 固定截断窗口；机械塞入检索片段
- **问题：** 容易破坏 KV cache 前缀，且与推理过程脱节

**CLM 在线 RL 方案（Qwen3.5-9B）**

- CLM：绕过固定脚本，把「编辑上下文文件」变成 RL 动作
- Qwen3.5-9B 在线 RL 训练策略
- 模型自管理的 Context 文件层 → 直接写入 / 整理
- 主动保留高价值领域信息
- 按需读取反馈
- 同步提升任务专精与 KV cache 效率

> **低成本技术可行路径：** 把「如何记笔记」直接纳入强化学习策略优化。

**适合方向：** 高校实验室、科研软件工具与垂直 Agent 创业团队。

---

## 10 / 16 · PART 3 · 开放难题 #2 · Character Training｜模型性格与价值观训练

**OPEN PROBLEM #2 · CHARACTER TRAINING**

重新塑造模型性格与行为准则，直接迁移到 Agent 长期自主行为、用户信任与系统安全。

---

### ① 性格训练到底影响什么？—— 不是语法修饰，而是决策底色

过去对齐多聚焦于单纯拒答；当模型作为自主 Agent 长链条运行并调用工具时，下面 4 项关键行为都由 Character Training 决定，且会在多轮交互中持续放大：

- **审慎度** —— 面对高风险决策时才确认再执行
- **诚实承认不知** —— 缺证据时如实说明，不编造信息
- **不迎合用户** —— 抗 sycophancy，不逆着错误假设附和
- **不擅自越权** —— 严格遵守工具、数据与权限边界

---

### ② 现有差距：闭源已重构 · 开源评测近空白

工业界已用新版 Model Spec 重做。开源界实验室已经围绕 Agent 时代的新版 Model Spec 彻底重写了性格训练流程。相比之下，开源社区长期只做数学与代码分数，自 Open Character Training（Maiya et al., 2025）之后，性格训练的实证与行为一致性评测几乎停滞。

**Trillium Labs 首批方向：** 建立可复现的开源 Character 训练配方与 Agent 行为一致性评测基准。

---

### 路线对比：Constitutional AI vs Model Specs（Maiya et al., 2025）

| 对比维度 | Constitutional AI（原则驱动） | Model Specs（规范清单驱动） | 开放难题 #2 |
|---|---|---|---|
| **核心训练机制** | 用一组高层宪法原则引导模型自我批评、修整输出并做偏好训练 | 编写分层、具体、可逐步核验的行为规范书，直接构造对照训练信号 | 如何把抽象价值观转为工具调用与代码执行时的可训练奖励 |
| **工程权衡** | 原则简洁、跨场景泛化强，但面对边界冲突时容易出现解释漂移 | 优先级明确、方便回归测试，但长尾条款维护成本高 | 如何在「守住高风险底线」与「避免僵硬死板」之间建立平滑梯度 |
| **开源社区现状** | 学术界早期复现较多，但少见针对长链条 Agent 的系统性工作 | 工业界普遍转向 Agent 版 Model Spec，开源参考实现与基准严重滞后 | 补齐抗诱导性、诚实度与权限规范的可复现开源评测集 |

---

## 11 / 16 · PART 3 · 开放难题 #3 · 开源 RL 环境与数据公共池

**OPEN PROBLEM #3 · RL DATA & ENVIRONMENTS**

缺少干净可验证的交互环境，投入再多 RL 算力也只会在噪声奖励上空转。

---

**现状缺失：至今没有后训练版的「Data Commons」**

预训练已有 Dolma / FineWeb 等公开语料基座；后训练虽然已有 Nemotron、Olmo、OpenThoughts 等公开数据集，但距离覆盖多样化的真实交互 RL 环境还远远不够。

**数据工程实质：好数据的门槛 —— 逐条重读模型与环境交互**

决定数据上限的不是盲目扩大合成数量，而是作者亲随逐条检查模型输出与沙盒运行日志，剔除题义歧义、测试误杀和假阳性奖励。

> **中间链接：** Docker + 单元测试 · 驱动 2B–27B Qwen 达到 Terminal-Bench 领先水平

---

### 工程实例：TMax 九轴任务生成 → 审计 / 修复闭环

![图 11-1　九轴任务生成到审计修复闭环](/images/post-training-cornell-2026/fig15_nine_axis_loop.png)

*图 11-1　九轴任务生成到审计修复闭环（自原图裁切）*

**STEP 1｜九轴任务设计空间**

- 工具类型 · 领域场景 · 故障模式
- 环境复杂度 · 依赖层级 · 难度梯度
- 交互步数 · 权限边界 · 验收维度

> 系统覆盖长尾命令组合。

**STEP 2｜Generator 生成器**

自动合成完整运行环境：

1. 任务指令 + 初始代码仓
2. Docker 容器 + 单元测试

自动生成可复现基准解。

**STEP 3｜Auditor 审计器（质量把关）**

在真实容器内试跑核验：

- 题目的有无歧义？测试会误杀吗？
- 存在基准解可稳定通关吗？

> 剔除噪声与假阳性奖励。

**修复回路｜Repairer 修复器**

不通过 → 自动修正 Docker 依赖或单测漏洞 → 重新生成并复审。

**输出｜VERIFIED RL ENV POOL**

高纯度 RL 环境池 → 2B–27B 开源 Qwen 取得 Terminal-Bench 领先表现。

---

## 12 / 16 · PART 3 · 开放难题 #4（上）· RL 推理效率与 CoT 压缩机理

**OPEN PROBLEM #4 (PART A) · RL EFFICIENCY**

为什么新一代模型用同等甚至更少 Token 就能大幅提分？适合小规模实验验证的关键课题。

---

### Claude Opus 4.7 vs 4.6 Effort-Token 效率曲线（Apr. 2026）

![图 12-1　Claude Opus 4.7 vs 4.6 Effort-Token 效率曲线](/images/post-training-cornell-2026/fig16_opus_effort_curve.png)

*图 12-1　Claude Opus 4.7 vs 4.6 Effort-Token 效率曲线（自原图裁切）*

全档位领先。

- 纵轴：综合推理准确率（40% – 80%）
- 横轴：推理思考消耗 Token 数量（0 – 240k）
- Opus 4.7 max（~74% @ 210k）
- Opus 4.6 max（~61% @ 118k）
- 4.7 low ~51% @ 33k
- Opus 4.6 low（~39%）
- 标注：同 Token 下效率大幅提升

---

### 实测档位对比：起步效率与上限同步抬升

| 档位 | Opus 4.7 | Opus 4.6 | 结论 |
|---|---|---|---|
| **LOW（低思考预算）** | **~51% @ 33k** | ~39% | 最低档即接近 Opus 4.6 中高档位水平 |
| **MAX（最高思考预算）** | **~74% @ 210k** | ~61% @ 118k | 不仅上限更高，长预算下仍可持续把 Token 转化为正确率 |

---

### 开放研究问题：CoT Token 效率背后的机理

当前学界严重缺乏基于「思维链效率跃升」的系统性机理研究，核心待解两点：

1. **压缩无效循环** —— 如何在不误探索能力的前提下，奖励紧凑推理步并减少冗余重复？
2. **全区间斜率提升** —— 为何 Opus 4.7 在 33k–210k 跨度上均保持更高的准确率增益？

> **小结｜小规模可复现：** 思维链压缩与长度惩罚设计完全可以在小规模数学 / 代码任务上验证规律。

---

## 13 / 16 · PART 3 · 开放难题 #4（下）· Never Give Up｜破解难题梯度消失

**OPEN PROBLEM #4 (PART B) · NEVER GIVE UP**

标准 GRPO 在「16 次采样全错」的高难题上无梯度可学，动态扩样策略将代码任务推至 ~94%。

---

> **痛点诊断：** 常规 RL 的多数增益来自「本来偶尔能做对的简单题」；遇到「16 次采样全错」的高难题，标准 GRPO 组内相对奖励方差为 0，梯度归零并跳过学习。

---

### 3,000 步代码任务训练曲线：NGU vs 标准 GRPO（Noukhovitch et al., 2026）

![图 13-1　3,000 步代码任务训练曲线：NGU vs 标准 GRPO](/images/post-training-cornell-2026/fig17_ngu_training_curve.png)

*图 13-1　3,000 步代码任务训练曲线：NGU vs 标准 GRPO（自原图裁切）*

- 纵轴：0% – 100%
- 横轴：0 – 3,000 步
- **NGU 持续升至 ~94%**
- **+14 pct 越过平台期**
- 标准 GRPO 停滞（~80%）

---

### NGU 核心机制对比：用概率扩容打捞稀缺正样本

![图 13-2　NGU 核心机制对比](/images/post-training-cornell-2026/fig18_ngu_mechanism.png)

*图 13-2　NGU 核心机制对比（自原图裁切）*

| 方案 | 机制 | 结果 |
|---|---|---|
| **标准 GRPO** | 16 次全错 | **梯度为 0** → 直接放弃（难题失学） |
| **NGU（Never Give Up）** | 按概率 p 扩批采样 | **捞出正样本** → **恢复梯度** |

> **核心效果：** 把采样算力集中投向处于能力边界、常规批次几乎拿不到正反馈的难题。

---

### 方法论反思（作者原话）

作者坦言在 RL 中设计绝对公平的对比实验「**惊人地困难（surprisingly hard）**」——动态扩样会改变单步 Token 与总采样成本，如何在实验里对齐算力预算与步数口径本身就是硬课题。

---

## 14 / 16 · PART 3 · 开放难题 #5 · 为后训练建立可预测的 RL Scaling Laws

**OPEN PROBLEM #5 · RL SCALING LAWS**

像预训练 Performance Ladder 一样：用小算力试跑，提前预测百倍算力下的最优配方与上限。

---

### ScaleRL S 形拟合曲线示意图（Khatri et al., 2025）· Sigmoidal Fit

![图 14-1　ScaleRL S 形拟合曲线（Sigmoidal Fit）](/images/post-training-cornell-2026/fig19_scalerl_s_curve.png)

*图 14-1　ScaleRL S 形拟合曲线（Sigmoidal Fit）（自原图裁切）*

- 纵轴：可验证任务通过率 / 得分
- 横轴：RL 训练算力投入（Log Compute）
- 小算力试跑观测点（低成本）
- 外推预测的大规模最终表现
- 渐近性能上限（Asymptote A）
- 大规模集群预测目标点

**三个阶段：**

1. 起步探索区
2. 对数线性快速爬坡区
3. 饱和逼近区

---

### 命题 ① · Performance Ladder —— 建立后训练的「性能阶梯」

预训练已有成熟的 Chinchilla / Performance Ladder：在小模型、小算力上调好配方与超参，就能可靠预测万卡集群的 Loss。大规模 RL 至今仍大量依靠工程经验反复试错。

**目标：** 在真正投入数百万美元算力前，提前预测 RL 收益曲线。

---

### 命题 ② · RL 数据选择规范 —— 什么样的数据配比能推高上限？

决定 S 形曲线爬坡斜率与渐近上限 A 的，主要是以下三个核心实验变量（当前仍缺少定量实验规范）：

1. **任务难度分布** —— 简单题、中等题与能力边界难题的采样比例
2. **多领域配比** —— 数学、代码与 Agent 交互数据的混合权重
3. **验证器噪声容忍度** —— 假阳性 / 误杀测试对渐近上限的影响

**直接用途：** 在小算力试跑阶段筛选高效数据组合，避免在大集群上浪费算力。

---

## 15 / 16 · PART 3 · 开放难题 #6 · Multi-Agent Scaling Laws｜并行换延迟与上限

**OPEN PROBLEM #6 · MULTI-AGENT SCALING**

最高算力方向：用多智能体并行算力同时压缩墙钟耗时，并推动单模型触及不到的难题突破。

---

### 图一｜OpenAI GPT-5.6 Sol · SEC-Bench Pro · Jul. 2026

![图 15-1　并行换延迟：轮次—通过率曲线](/images/post-training-cornell-2026/fig20_round1_line.png)

*图 15-1　并行换延迟：轮次—通过率曲线（自原图裁切）*

并行度换取低墙钟延迟（Wall-clock Latency）示意图。

- 纵轴：安全评测得分
- 横轴：短延迟 ← 墙钟延迟时间（Log Latency）→ 长延迟
- 16-agent 在全延迟区间均占优
- 曲线梯度：16-agent / 4-agent / 1-agent

---

### 图二｜Anthropic Claude Opus 5.5 · Lean 定理证明 · Sep. 2026

![图 15-2　并行换延迟：柱状对比](/images/post-training-cornell-2026/fig21_round2_bar.png)

*图 15-2　并行换延迟：柱状对比（自原图裁切）*

1 / 10 / 30 / 100 Agents × 2h / 6h / 24h 窗口扩展规律。

- 纵轴：定理形式化证明通过率
- 横轴：2h 窗口 · 6h 窗口 · 24h 窗口
- 柱状图图例：1（浅灰）/ 10（深蓝）/ 30（红褐）/ 100 Agents 并行（深绿）

---

### 三大核心追问

1. **任务可并行性** —— 哪些难题适合并行探索，哪些受限于强串行瓶颈？
2. **模型多样性** —— 16 个同构副本与多模型异构协同的增益差异从何而来？
3. **训练期对齐** —— 如何在 RL 训练阶段原生训练 Sub-agent 的分工与通信？

---

## 16 / 16 · PART 4 · 收尾反思 · RSI 与科研边界｜产出提速 2–4×，理解仍是慢变量

**RSI · OUTPUT VS UNDERSTANDING**

当 Anthropic 内部 AL4 半年升至 26% 之后，Nathan Lambert 对三年后训练科研的复盘。

---

### 图一｜Anthropic 内部研发自动化指数（Aug 2025 – Aug 2028）

![图 16-1　Anthropic 内部研发自动化指数](/images/post-training-cornell-2026/fig22_final_bar.png)

*图 16-1　Anthropic 内部研发自动化指数（自原图裁切）*

AI 辅助（AL3）与 Claude 主导（AL4）占比变化，堆叠柱状图：

| 时间 | AL3 辅助 | AL4（Claude 主导） | 备注 |
|---|---|---|---|
| 2025.08 | 约 43% | — | — |
| 2026.02 | 合计约 90%+ | &lt;1% | AL4 极小 |
| 2026.08 | ~69% | 26% | 合计 >95% |

> 半年内 Claude 主导研发任务（AL4）从 &lt;1% 升至 26%，AL3 与 AL4 合计覆盖超 95% 内部研发工作流。

**原演讲核心判断：** 「LLM 极大加速产出（Output），但几乎不加速理解（Understanding）。」

---

### 图二｜过去三年科研工作真实复盘

| AI 影响程度 | 代表项目 | 真实原因 |
|---|---|---|
| **提速 2–4×** | Zephyr β<br>Tülu 2<br>RewardBench | 套用已知方法与标准流程，写代码、跑脚本、整理评测的效率成倍提升 |
| **仍难替代** | Tülu 3<br>Olmo 2 & 3 | 跨阶段系统工程、问题定义与方向取舍，关键瓶颈依然在人类理解 |

---

### 对初级研究者的真实挑战

当 AI 接管了大部分数据清洗、调试和跑基线等低效手工环节后，新手很容易跳过「逐条检查坏样本、在试错中建立工程直觉」的过程，从而更难在复杂项目里做出关键判断。

---

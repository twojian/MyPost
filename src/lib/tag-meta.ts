/**
 * 标签配色（Catppuccin Latte / Mocha 双模式）。
 *
 * 设计要点：
 * - 颜色以 CSS 变量形式输出（`--ctp-*`），由 globals.css 的 `:root` / `.dark`
 *   分别给出 Latte / Mocha 的色值，因此在浅色与深色主题下自动切换。
 * - 语义优先：先查关键词规则表，命中即用该色；未命中的标签用名称哈希兜底，
 *   保证同一个标签在任何页面（列表 / 侧栏 / 文章 / 搜索）颜色始终一致。
 */

/** Catppuccin 的 14 个强调色（键名与 CSS 变量 `--ctp-<key>` 对应） */
export const TAG_ACCENTS = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
] as const;

export type TagAccentKey = (typeof TAG_ACCENTS)[number];

interface TagAccentRule {
  accent: TagAccentKey;
  keywords: string[];
}

/**
 * 语义规则表：顺序敏感，更具体的规则排在前面。
 * 408 四科按规范固定映射：计算机网络=blue、操作系统=green、
 * 数据结构=peach、计算机组成原理=mauve。
 */
const TAG_ACCENT_RULES: TagAccentRule[] = [
  { accent: "blue", keywords: ["计算机网络", "网络", "network", "tcp", "http", "dns", "路由"] },
  { accent: "green", keywords: ["操作系统", "os", "linux", "进程", "内核"] },
  { accent: "peach", keywords: ["数据结构", "算法", "algorithm", "树", "图"] },
  { accent: "mauve", keywords: ["计算机组成原理", "组成原理", "计组", "硬件"] },
  { accent: "sapphire", keywords: ["408"] },
  { accent: "maroon", keywords: ["真题", "试卷", "习题"] },
  { accent: "yellow", keywords: ["考研", "复习", "考纲", "应试"] },
  { accent: "lavender", keywords: ["笔记", "note", "总结", "二级结论"] },
  { accent: "teal", keywords: ["代码", "code", "实现", "编程"] },
  { accent: "pink", keywords: ["深度学习", "机器学习", "神经网络", "deep", "ml", "pytorch"] },
  { accent: "flamingo", keywords: ["nlp", "大模型", "llm", "transformer", "语言模型"] },
  { accent: "sky", keywords: ["ai", "人工智能", "agent", "aigc"] },
  { accent: "rosewater", keywords: ["html", "css", "前端", "网页", "javascript", "react"] },
  { accent: "teal", keywords: ["工程", "实践", "部署", "运维", "工程实践"] },
  { accent: "lavender", keywords: ["科研", "论文", "paper", "研究"] },
];

/** 标签名 → Catppuccin 强调色键名 */
export function getTagAccentKey(name: string): TagAccentKey {
  const lower = name.toLowerCase();
  for (const rule of TAG_ACCENT_RULES) {
    if (rule.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return rule.accent;
    }
  }
  // 兜底：按字符码点稳定哈希，保证同名标签永远同色
  let hash = 0;
  for (const ch of Array.from(name)) {
    hash = (hash * 31 + ch.codePointAt(0)!) % 1000000007;
  }
  return TAG_ACCENTS[hash % TAG_ACCENTS.length];
}

/** 标签名 → CSS 变量表达式（可直接用于 inline style） */
export function getTagAccentColor(name: string): string {
  return `var(--ctp-${getTagAccentKey(name)})`;
}

/** 分类名 → CSS 变量表达式（分类徽章复用标签色板，保持全局一致） */
export function getCategoryAccentColor(name: string): string {
  return getTagAccentColor(name);
}

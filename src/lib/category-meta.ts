import {
  BrainCircuit,
  CircuitBoard,
  Code2,
  Cpu,
  FolderOpen,
  GitBranch,
  Layers,
  MessagesSquare,
  MonitorCog,
  Network,
  ScanEye,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface CategoryMeta {
  /** 分类图标 */
  icon: LucideIcon;
  /** 分类强调色（图标 / 底纹 / 激活态都用它派生） */
  color: string;
}

interface CategoryRule extends CategoryMeta {
  keywords: string[];
}

/**
 * 分类 → 图标 + 强调色 的规则表。
 * 按数组顺序匹配，命中即返回，因此更具体的规则要排在前面
 * （如「AI Infra」需先于「技术」被识别）。
 */
const CATEGORY_RULES: CategoryRule[] = [
  // ===== 408 考研四科（先于「技术」匹配，避免被宽松规则吞掉） =====
  { keywords: ["计算机网络", "计网"], icon: Network, color: "var(--ctp-blue)" },
  { keywords: ["操作系统"], icon: MonitorCog, color: "var(--ctp-green)" },
  { keywords: ["数据结构"], icon: GitBranch, color: "var(--ctp-peach)" },
  { keywords: ["计算机组成原理", "组成原理", "计组"], icon: CircuitBoard, color: "var(--ctp-mauve)" },

  { keywords: ["infra", "基础设施", "运维", "部署", "infrastructure"], icon: Cpu, color: "var(--ctp-teal)" },
  // ===== 深度学习细分主题（必须排在「深度学习」通用规则之前） =====
  { keywords: ["深度学习基础", "神经网络基础", "深度学习入门"], icon: BrainCircuit, color: "var(--ctp-pink)" },
  { keywords: ["模型架构", "网络架构", "架构", "architecture"], icon: Layers, color: "var(--ctp-mauve)" },
  { keywords: ["训练与调优", "训练技巧", "调优", "优化器", "training"], icon: SlidersHorizontal, color: "var(--ctp-sapphire)" },
  { keywords: ["生成模型", "扩散", "diffusion", "gan", "vae", "generative"], icon: Sparkles, color: "var(--ctp-maroon)" },
  // 备用规则：待有多模态笔记时自动生效（当前无该分类的笔记，故不建分类）
  { keywords: ["多模态", "multimodal"], icon: ScanEye, color: "var(--ctp-sky)" },
  { keywords: ["深度学习", "机器学习", "deep", "neural", "神经网络"], icon: BrainCircuit, color: "var(--ctp-pink)" },
  { keywords: ["nlp", "自然语言", "大模型", "llm", "语言模型"], icon: MessagesSquare, color: "var(--ctp-flamingo)" },
  { keywords: ["工程", "实践", "项目", "engineering"], icon: Wrench, color: "var(--ctp-yellow)" },
  { keywords: ["公式", "数学", "算法", "math"], icon: Sigma, color: "var(--ctp-lavender)" },
  { keywords: ["技术", "开发", "编程", "tech", "code"], icon: Code2, color: "var(--ctp-lavender)" },
];

const FALLBACK: CategoryMeta = {
  icon: FolderOpen,
  color: "var(--color-brand)",
};

/** 根据分类名解析出图标与强调色，未命中时回退为文件夹图标 + 品牌色 */
export function getCategoryMeta(name: string): CategoryMeta {
  const lower = name.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return { icon: rule.icon, color: rule.color };
    }
  }
  return FALLBACK;
}

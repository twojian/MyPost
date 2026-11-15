/**
 * 文字颜色语法糖（源码级预处理）
 * ------------------------------------------------------------------
 * 为什么不用 remark 插件：
 * MDX v3 在 parse 阶段就会用 acorn 解析 `{...}` 表达式，
 * `{red|文字}` 不是合法的 JS 表达式，插件还没执行就已经抛
 * "Could not parse expression with acorn"。因此必须在把源码交给
 * MDXRemote 之前做一次源码级替换。
 *
 * 写法：
 *   {red|这段文字是红色}   ← 推荐，最不易误伤
 *   {red:这段文字是红色}
 *   {red这段文字是红色}    ← 裸写法，颜色名后必须是中文字符
 * 输出：
 *   <span className="text-ctp-red">这段文字是红色</span>
 *
 * 安全性（替换前先屏蔽这些区域，绝不改动）：
 * - 围栏代码块 ``` / ~~~
 * - 行内代码 `...`
 * - 行内公式 $...$、公式块 $$...$$
 * - 只接受「颜色关键字 + | 或 :」，且左花括号前不能是 `{`
 *   （因此 style={{color:"red"}} 这类 JSX 双花括号不会被误伤）
 */

export const TEXT_COLORS = [
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

export type TextColor = (typeof TEXT_COLORS)[number];

/** 别称在输出时会保留自己的类名（如 text-ctp-orange），便于各处精细调色 */
export type TextColorClass = TextColor | "orange" | "purple" | "gray";

const COLOR_SET = new Set<string>(TEXT_COLORS);

/** 常见别称 → 类名后缀（Catppuccin 没有 orange/purple/gray，用最接近的色系派生） */
const COLOR_ALIASES: Record<string, TextColorClass> = {
  gray: "gray",
  grey: "gray",
  orange: "orange",
  cyan: "sky",
  purple: "purple",
  rose: "rosewater",
  magenta: "pink",
};

function resolveColor(key: string): TextColorClass | null {
  if (COLOR_SET.has(key)) return key as TextColor;
  return COLOR_ALIASES[key] ?? null;
}

const PLACEHOLDER = "\u0000";

/** 把代码块 / 行内代码 / 公式区域替换成占位符，避免被颜色语法误伤 */
function maskProtected(source: string): { masked: string; store: string[] } {
  const store: string[] = [];
  let out = "";
  let index = 0;
  const length = source.length;

  const push = (segment: string) => {
    store.push(segment);
    out += `${PLACEHOLDER}${store.length - 1}${PLACEHOLDER}`;
  };

  while (index < length) {
    const char = source[index];

    // 围栏代码块
    if (source.startsWith("```", index) || source.startsWith("~~~", index)) {
      const fence = source.slice(index, index + 3);
      const closeIndex = source.indexOf(fence, index + 3);
      const stop =
        closeIndex === -1
          ? length
          : (() => {
              const lineEnd = source.indexOf("\n", closeIndex);
              return lineEnd === -1 ? length : lineEnd + 1;
            })();
      push(source.slice(index, stop));
      index = stop;
      continue;
    }

    // 公式块 $$...$$
    if (source.startsWith("$$", index)) {
      const closeIndex = source.indexOf("$$", index + 2);
      const stop = closeIndex === -1 ? length : closeIndex + 2;
      push(source.slice(index, stop));
      index = stop;
      continue;
    }

    // 行内公式 $...$
    if (char === "$") {
      const closeIndex = source.indexOf("$", index + 1);
      const lineEnd = source.indexOf("\n", index + 1);
      const usable =
        closeIndex !== -1 && (lineEnd === -1 || closeIndex < lineEnd);
      if (usable) {
        push(source.slice(index, closeIndex + 1));
        index = closeIndex + 1;
        continue;
      }
    }

    // 行内代码 `...`
    if (char === "`") {
      let runEnd = index;
      while (runEnd < length && source[runEnd] === "`") runEnd += 1;
      const fence = source.slice(index, runEnd);
      const closeIndex = source.indexOf(fence, runEnd);
      if (closeIndex !== -1) {
        push(source.slice(index, closeIndex + fence.length));
        index = closeIndex + fence.length;
        continue;
      }
    }

    out += char;
    index += 1;
  }

  return { masked: out, store };
}

const COLOR_PATTERN = /\{([a-z]{3,12})\s*([|:])\s*([^{}\n]+?)\s*\}/g;

/** 裸写法 {red文字}：颜色名后必须紧跟中日韩等非拉丁字符，避免误伤 JS 标识符 */
const BARE_PATTERN = /\{([a-z]{3,12})([^\x00-\x7F][^{}\n]*?)\s*\}/g;

function buildSpan(color: TextColorClass, text: string): string {
  return `<span className="text-ctp-${color}">${text}</span>`;
}

/** 把源码中的 {red|文字} 语法替换为可被 MDX 直接解析的 JSX */
export function applyTextColors(source: string): string {
  if (!source.includes("{")) return source;

  const { masked, store } = maskProtected(source);

  const replaced = masked
    .replace(
      COLOR_PATTERN,
      (match: string, rawColor: string, _sep: string, rawText: string, offset: number) => {
        const color = resolveColor(rawColor);
        if (!color) return match;

        // 左花括号前紧邻 `{` 说明是 JSX 双花括号（style={{...}}），跳过
        if (offset > 0 && masked[offset - 1] === "{") return match;

        const text = rawText.trim();
        if (!text) return match;

        return buildSpan(color, text);
      },
    )
    .replace(
      BARE_PATTERN,
      (match: string, rawColor: string, rawText: string, offset: number) => {
        const color = resolveColor(rawColor);
        if (!color) return match;
        if (offset > 0 && masked[offset - 1] === "{") return match;

        const text = rawText.trim();
        if (!text) return match;

        return buildSpan(color, text);
      },
    );

  let restored = replaced;
  for (let i = store.length - 1; i >= 0; i -= 1) {
    // 用函数式替换：store 里可能是 `$`、`$&` 等代码片段，
    // 直接当替换字符串传入会被 replaceAll 解析成"匹配前缀/整段匹配"，
    // 导致内容被成倍复制（LaTeX 页含 `$` 代码块时直接撑爆内存）。
    restored = restored.replaceAll(`${PLACEHOLDER}${i}${PLACEHOLDER}`, () => store[i]);
  }
  return restored;
}

export default applyTextColors;

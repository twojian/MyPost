import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import type { PluggableList } from "unified";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeImageFigure from "@/lib/rehype-image-figure";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

/**
 * 正文 MDX 编译插件链（唯一出口）
 * ------------------------------------------------------------------
 * 改动顺序注意：
 * - remark-math 必须在最前，先把 `$...$` / `$$...$$` 转成 math 节点，
 *   这样后面的记号笔（==）不会误伤公式里的符号。
 * - rehype-slug 必须在 rehype-autolink-headings 之前，锚点依赖 slug 生成的 id。
 * - rehype-pretty-code 放在 rehype-katex 之前，避免 KaTeX 生成的标记被 shiki 处理。
 * - 文字颜色（{red|文字}）不是合法 JS 表达式，MDX 在 parse 阶段就会报错，
 *   因此它由 src/lib/text-color.ts 在源码级预处理，不在这条链里。
 */
export const remarkPlugins: PluggableList = [
  remarkMath,
  remarkGfm,
  remarkFlexibleMarkers,
];

/**
 * Catppuccin 双主题：浅色 Latte、深色 Mocha。
 * keepBackground 交给 globals.css 的 `--code-block-bg` 控制，避免与自带底色叠加。
 * rehype-pretty-code 会按文档中实际出现的语言按需加载高亮语法（不会打全量语言包）。
 */
export const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: "catppuccin-latte",
    dark: "catppuccin-mocha",
  },
  keepBackground: false,
  bypassInlineCode: true,
  defaultLang: "plaintext",
};

export const rehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypePrettyCode, prettyCodeOptions],
  // 图片图注：把「整段只有一张带 title 的图」的段落转成 figure + figcaption
  rehypeImageFigure,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaHidden: "true",
        tabIndex: -1,
      },
    },
  ],
  [rehypeKatex, { strict: false }],
];

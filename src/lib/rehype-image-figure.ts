import type { Element, ElementContent, Root, RootContent } from "hast";

/**
 * 图片图注（rehype 阶段）
 * ------------------------------------------------------------------
 * Markdown 的 `![alt](src "图注")` 会被解析成段落里的 inline img。
 * 如果直接在 MDXComponents 的 img 映射里返回 <figure>，产物会变成
 * `<p><figure>…` —— figure 是块级元素，不能嵌在 p 里（非法嵌套，
 * 浏览器会强行闭合 p，React 也可能报 hydration 警告）。
 *
 * 因此在 rehype 阶段把「整段只有一张图」的段落整体替换为：
 *   <figure class="mdx-figure"><img …/><figcaption>图注</figcaption></figure>
 * 并把 title 从 img 上摘掉，避免 MDXComponents 的 img 再包一层 figure。
 *
 * 只有存在 title 时才生成 caption；没有 title 的图片保持原样。
 * （在 MDX 里手写 JSX 的 <img title="…" /> 不经过这里，仍由组件映射处理。）
 */

const FIGURE_CLASS = "mdx-figure";

function isBlankText(node: ElementContent): boolean {
  return node.type === "text" && node.value.trim() === "";
}

function findSoleImage(node: Element): Element | null {
  const significant = node.children.filter((child) => !isBlankText(child));
  if (significant.length !== 1) return null;
  const [only] = significant;
  if (only.type !== "element" || only.tagName !== "img") return null;
  return only;
}

function stripTitle(img: Element): string | null {
  const title = img.properties?.title;
  if (typeof title !== "string" || !title.trim()) return null;
  delete img.properties.title;
  return title;
}

function transform(parent: { children: RootContent[] }): void {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index];
    if (child.type !== "element") continue;

    if (child.tagName === "p") {
      const img = findSoleImage(child);
      const caption = img ? stripTitle(img) : null;
      if (img && caption) {
        const figure: Element = {
          type: "element",
          tagName: "figure",
          properties: { className: [FIGURE_CLASS] },
          children: [
            img,
            {
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: [{ type: "text", value: caption }],
            },
          ],
        };
        parent.children[index] = figure;
        continue;
      }
    }

    transform(child);
  }
}

const rehypeImageFigure = () => (tree: Root) => {
  transform(tree);
};

export default rehypeImageFigure;

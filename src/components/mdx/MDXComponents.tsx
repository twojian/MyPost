import type { MDXComponents as MDXComponentsType } from "mdx/types";
import CodeBlock from "./CodeBlock";
import Callout from "./Callout";
import Details from "./Details";
import ExternalAnchor from "./ExternalAnchor";

export const mdxComponents: MDXComponentsType = {
  pre: ({ children, ...props }) => <CodeBlock {...props}>{children}</CodeBlock>,
  Callout,
  Details,
  img: ({ src, alt, title, ...props }) => {
    // 有 title 时输出 figure + figcaption 图注，没有 title 时保持原来的裸 img
    if (title) {
      return (
        <figure className="mdx-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt ?? ""} className="rounded-xl" loading="lazy" {...props} />
          <figcaption>{title}</figcaption>
        </figure>
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        className="my-4 rounded-xl"
        loading="lazy"
        {...props}
      />
    );
  },
  a: ({ href, children, ...props }) => (
    <ExternalAnchor href={href} {...props}>
      {children}
    </ExternalAnchor>
  ),
  table: ({ children, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full" {...props}>
        {children}
      </table>
    </div>
  ),
};

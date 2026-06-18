import type { MDXComponents as MDXComponentsType } from "mdx/types";
import CodeBlock from "./CodeBlock";
import Callout from "./Callout";

export const mdxComponents: MDXComponentsType = {
  pre: ({ children, ...props }) => <CodeBlock {...props}>{children}</CodeBlock>,
  Callout,
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="my-4 rounded-xl"
      loading="lazy"
      {...props}
    />
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  table: ({ children, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full" {...props}>
        {children}
      </table>
    </div>
  ),
};

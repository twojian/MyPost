import type { MDXComponents as MDXComponentsType } from "mdx/types";
import CodeBlock from "./CodeBlock";
import Callout from "./Callout";
import Collapsible from "./Collapsible";

// 自定义 Details 组件
function CustomDetails({ children, ...props }: React.HTMLAttributes<HTMLDetailsElement>) {
  return (
    <details 
      className="my-4 rounded-xl border border-gray-200 bg-white/50 p-4 shadow-sm" 
      {...props}
    >
      {children}
    </details>
  );
}

// 自定义 Summary 组件
function CustomSummary({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <summary 
      className="cursor-pointer font-semibold text-gray-800 hover:text-gray-900" 
      {...props}
    >
      {children}
    </summary>
  );
}

// 自定义 Span 组件，支持 style 属性
function CustomSpan({ style, children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { style?: React.CSSProperties }) {
  return (
    <span style={style} {...props}>
      {children}
    </span>
  );
}

export const mdxComponents: MDXComponentsType = {
  pre: ({ children, ...props }) => <CodeBlock {...props}>{children}</CodeBlock>,
  Callout,
  Collapsible,
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
  span: CustomSpan,
  details: CustomDetails,
  summary: CustomSummary,
  // 添加更多标准 HTML 标签的支持
  p: ({ children, ...props }) => <p {...props}>{children}</p>,
  br: () => <br />,
  strong: ({ children, ...props }) => <strong {...props}>{children}</strong>,
  em: ({ children, ...props }) => <em {...props}>{children}</em>,
  ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
  ol: ({ children, ...props }) => <ol {...props}>{children}</ol>,
  li: ({ children, ...props }) => <li {...props}>{children}</li>,
  blockquote: ({ children, ...props }) => <blockquote {...props}>{children}</blockquote>,
  code: ({ children, ...props }) => <code {...props}>{children}</code>,
  h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
  h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
  h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
};

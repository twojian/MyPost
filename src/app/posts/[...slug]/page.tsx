import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { getAllPosts, getPostBySlug, extractHeadings } from "@/lib/posts";
import { getSession } from "@/lib/auth";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import PostMeta from "@/components/post/PostMeta";
import TOCSidebar from "@/components/post/TOCSidebar";
import LikeButton from "@/components/post/LikeButton";

const STATIC_EXT = /\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|woff2?|ttf|eot|mp[34]|webm|pdf)$/i;

interface Props {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split("/").filter(Boolean),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  if (STATIC_EXT.test(slugPath)) return {};
  try {
    const { meta } = getPostBySlug(slugPath);
    return {
      title: meta.title,
      description: meta.summary,
    };
  } catch {
    return {};
  }
}

// 预处理内容，确保 HTML 标签能被正确处理
function preprocessContent(content: string): string {
  let processed = content;
  
  // 先统一换行符，方便处理
  processed = processed.replace(/\r\n/g, '\n');
  
  // 最关键的处理：确保 <details> 和 <summary> 标签前后都有明确的空行
  // 这是解决 MDX 解析问题的关键 - 更简单更直接的方法
  processed = processed.split('<details').join('\n\n<details');
  processed = processed.split('</details>').join('</details>\n\n');
  processed = processed.split('<summary').join('\n\n<summary');
  processed = processed.split('</summary>').join('</summary>\n\n');
  
  // 清理多余的空行
  processed = processed.replace(/\n{3,}/g, '\n\n');
  
  return processed;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  if (STATIC_EXT.test(slugPath)) notFound();
  let post;
  try {
    post = getPostBySlug(slugPath);
  } catch {
    notFound();
  }
  const { meta, content } = post;
  const processedContent = preprocessContent(content);
  const headings = extractHeadings(processedContent);
  const session = await getSession();

  return (
    <div className="flex items-start gap-6">
      {/* Article */}
      <article className="article-surface squircle relative min-w-0 flex-1 p-6 md:p-12">
        {session && (
          <a
            href={`/admin/posts/${slugPath}`}
            className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90"
          >
            编辑
          </a>
        )}
        <h1
          className="mb-4 text-3xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          {meta.title}
        </h1>

        <PostMeta
          date={meta.date}
          readingTime={meta.readingTime}
          wordCount={meta.wordCount}
          tags={meta.tags}
          categories={meta.categories}
        />

        <hr className="my-6 border-white/30" />

        <div className="prose-notion">
          <MDXRemote
            source={processedContent}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [
                  rehypeRaw,
                  rehypeSlug, 
                  [rehypeKatex, { strict: false }]
                ],
                format: 'mdx',
              },
            }}
          />
        </div>
      </article>

      {/* Right sidebar: TOC + Like — xl screens only */}
      <div className="hidden lg:flex w-56 shrink-0 flex-col gap-4 sticky top-28">
        <TOCSidebar headings={headings} />
        <LikeButton slug={slugPath} />
      </div>
    </div>
  );
}

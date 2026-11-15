import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { rehypePlugins, remarkPlugins } from "@/lib/mdx-plugins";
// 文字颜色语法糖必须在交给 MDX 之前做源码级替换（{red|文字} 不是合法 JS 表达式）
import { applyTextColors } from "@/lib/text-color";
import { getAllPosts, getPostBySlug, getPostsByPrefix, isDirectorySlug, extractHeadings } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import PostMeta from "@/components/post/PostMeta";
import PostDateList from "@/components/post/PostDateList";
import TOCSidebar from "@/components/post/TOCSidebar";
import LikeButton from "@/components/post/LikeButton";

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
  if (isDirectorySlug(slugPath)) {
    return { title: slugPath.split("/").pop() ?? "目录" };
  }
  const { meta } = getPostBySlug(slugPath);
  return {
    title: meta.title,
    description: meta.summary,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  if (isDirectorySlug(slugPath)) {
    const posts = getPostsByPrefix(slugPath);
    return (
      <>
        <h1
     className="mb-2 text-2xl font-bold text-fg"
   >
          {slugPath.split("/").pop()}
        </h1>
        <p className="mb-6 text-sm text-muted">
          {posts.length} 篇文章
        </p>
        <PostDateList posts={posts} />
      </>
    );
  }

  const { meta, content } = getPostBySlug(slugPath);
  const headings = extractHeadings(content);

  return (
    <div className="flex items-start gap-6">
      {/* Article */}
      <article className="article-surface squircle min-w-0 flex-1 p-6 md:p-12">
        <h1
     className="mb-4 text-3xl font-bold text-fg"
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

        <hr className="my-6 border-[var(--color-hairline)]" />

        <div className="prose-notion mx-auto w-full max-w-[72ch]">
          <MDXRemote
            source={applyTextColors(content)}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins,
                rehypePlugins,
              },
            }}
          />
        </div>
      </article>

      {/* Right sidebar: TOC + Like — lg 以上常显，避免窄窗口下目录整块消失 */}
      <div className="hidden lg:flex w-52 xl:w-56 shrink-0 flex-col gap-4 sticky top-28">
        <TOCSidebar headings={headings} />
        <LikeButton slug={slugPath} />
      </div>
    </div>
  );
}

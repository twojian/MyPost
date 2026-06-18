import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostBySlug, extractHeadings } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import PostMeta from "@/components/post/PostMeta";
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
  const { meta } = getPostBySlug(slugPath);
  return {
    title: meta.title,
    description: meta.summary,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const { meta, content } = getPostBySlug(slugPath);
  const headings = extractHeadings(content);

  return (
    <div className="flex items-start gap-6">
      {/* Article */}
      <article className="article-surface squircle min-w-0 flex-1 p-6 md:p-12">
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
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeKatex, { strict: false }]],
              },
            }}
          />
        </div>
      </article>

      {/* Right sidebar: TOC + Like — xl screens only */}
      <div className="hidden xl:flex w-56 shrink-0 flex-col gap-4 sticky top-28">
        <TOCSidebar headings={headings} />
        <LikeButton slug={slugPath} />
      </div>
    </div>
  );
}

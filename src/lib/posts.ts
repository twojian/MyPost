import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";

const CONTENT_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  categories: string[];
  draft: boolean;
  readingTime: string;
  wordCount: number;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = getFilesRecursively(CONTENT_DIR);

  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);
      const slug = filePath
        .replace(CONTENT_DIR, "")
        .replace(/\\/g, "/")
        .replace(/^\//, "")
        .replace(/\.mdx?$/, "");

      return {
        slug,
        title: data.title ?? "Untitled",
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "1970-01-01",
        summary: data.summary ?? data.description ?? "",
        tags: data.tags ?? [],
        categories: data.categories ?? [],
        draft: data.draft ?? false,
        readingTime: stats.text,
        wordCount: stats.words,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function decodeSlug(slug: string): string {
  // 路由 slug 可能含 URL 编码的中文路径段（如 %E6%93%8D...），先解码再拼文件路径
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function isDirectorySlug(slug: string): boolean {
  const decoded = decodeSlug(slug);
  const dir = path.join(CONTENT_DIR, decoded);
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

export function getPostsByPrefix(prefix: string): PostMeta[] {
  const decoded = decodeSlug(prefix);
  return getAllPosts().filter((p) => p.slug.startsWith(`${decoded}/`));
}

export function getPostBySlug(slug: string) {
  const decodedSlug = decodeSlug(slug);
  const mdxPath = path.join(CONTENT_DIR, `${decodedSlug}.mdx`);
  const mdPath = path.join(CONTENT_DIR, `${decodedSlug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    meta: {
      slug: decodedSlug,
      title: data.title ?? "Untitled",
      date: data.date
        ? new Date(data.date).toISOString().split("T")[0]
        : "1970-01-01",
      summary: data.summary ?? data.description ?? "",
      tags: data.tags ?? [],
      categories: data.categories ?? [],
      draft: data.draft ?? false,
      readingTime: stats.text,
      wordCount: stats.words,
    },
    content,
  };
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const catMap = new Map<string, number>();
  for (const post of posts) {
    for (const cat of post.categories) {
      catMap.set(cat, (catMap.get(cat) ?? 0) + 1);
    }
  }
  return Array.from(catMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function extractHeadings(content: string): { depth: number; text: string; id: string }[] {
  const slugger = new GithubSlugger();
  const headings: { depth: number; text: string; id: string }[] = [];
  // 兼容 CRLF 行尾：JS 中 . 不匹配 \r，先归一化再按行解析
  content = content.replace(/\r/g, "");
  let inCodeBlock = false;
  let inMathBlock = false;
  for (const line of content.split("\n")) {
    if (inCodeBlock) {
      // 闭围栏：允许 0-3 空格缩进（如 " ```"）
      if (/^ {0,3}(`{3,}|~{3,})\s*$/.test(line)) inCodeBlock = false;
      continue;
    }
    // 数学块：与渲染端 remark-math 对齐。
    // mathFlow 开行 = 纯 $$ 行，或 $$ + 空格 + 内容且行尾无闭合 $$；
    // 单行 $$...$$（mathText）不触发块级状态。闭行 = 独立 $$ 行。
    if (!inMathBlock && /^\$\$/.test(line)) {
      const pureLine = /^\$\$\s*$/.test(line);
      const trailingClose = /\$\$\s*$/.test(line);
      const noSpaceAfter = /^\$\$[^$\s]/.test(line);
      if (pureLine || (!trailingClose && !noSpaceAfter)) {
        inMathBlock = true;
        continue;
      }
      continue; // mathText 单行公式：不改变状态
    }
    if (inMathBlock) {
      if (/^\$\$\s*$/.test(line)) inMathBlock = false;
      continue;
    }
    // 开围栏：允许 0-3 空格缩进
    if (/^ {0,3}(`{3,}|~{3,})/.test(line)) { inCodeBlock = true; continue; }
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      const text = match[2]
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .trim();
      const id = slugger.slug(text);
      headings.push({ depth, text, id });
    }
  }
  return headings;
}

function getFilesRecursively(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getFilesRecursively(fullPath);
    if (/\.mdx?$/.test(entry.name) && entry.name !== "_index.md")
      return [fullPath];
    return [];
  });
}

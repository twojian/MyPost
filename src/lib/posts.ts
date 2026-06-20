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

export function getPostBySlug(slug: string) {
  // 解码 URL 编码的 slug
  const decodedSlug = decodeURIComponent(slug);
  
  const mdxPath = path.join(CONTENT_DIR, `${decodedSlug}.mdx`);
  const mdPath = path.join(CONTENT_DIR, `${decodedSlug}.md`);
  
  // 先尝试直接找文件
  let filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
  
  // 如果找不到，遍历所有文件来找匹配的
  if (!fs.existsSync(filePath)) {
    const allPosts = getAllPosts();
    const matchingPost = allPosts.find(post => 
      post.slug === decodedSlug || 
      post.slug === slug ||
      decodeURIComponent(post.slug) === decodedSlug ||
      decodeURIComponent(post.slug) === slug
    );
    
    if (matchingPost) {
      const tryMdx = path.join(CONTENT_DIR, `${matchingPost.slug}.mdx`);
      const tryMd = path.join(CONTENT_DIR, `${matchingPost.slug}.md`);
      filePath = fs.existsSync(tryMdx) ? tryMdx : tryMd;
    }
  }
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found for slug: ${slug} (decoded: ${decodedSlug})`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  // 找到实际的 slug
  const allPosts = getAllPosts();
  const actualPost = allPosts.find(post => 
    decodeURIComponent(post.slug) === decodedSlug || 
    post.slug === decodedSlug
  );
  const actualSlug = actualPost ? actualPost.slug : decodedSlug;
  
  return {
    meta: {
      slug: actualSlug,
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
  let inCodeBlock = false;
  
  // Normalize line endings and split
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  
  for (const line of lines) {
    if (line.startsWith("```")) { 
      inCodeBlock = !inCodeBlock; 
      continue; 
    }
    if (inCodeBlock) continue;
    
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

// Display names for top-level groups (matches Notion's top-level page titles).
const GROUP_TITLES: Record<string, { title: string; icon?: string; description?: string }> = {
  "notes/deep-learning": { title: "深度学习笔记", icon: "📖", description: "从感知机到 Transformer，逐章构建神经网络的完整理解。" },
  "notes/ai-infra":      { title: "AI Infra 学习笔记", icon: "🛠️", description: "大模型训练 / 推理基础设施：CUDA、并行训练、推理引擎。" },
  "notes/nlp":           { title: "NLP 笔记", icon: "🥋", description: "自然语言处理基础：分词、词向量、Transformer。" },
  "notes/minimind":      { title: "MiniMind 实战笔记", icon: "🧠", description: "从零实现大语言模型的完整路径。" },
  articles:              { title: "随笔与阅读", icon: "📝", description: "读书笔记、播客摘录与日常思考。" },
  blog:                  { title: "考研笔记", icon: "🎓", description: "408 / 数学复习的章节笔记。" },
  tutorials:             { title: "工具教程", icon: "🧰", description: "LaTeX、n8n 等工具的上手指南。" },
};

export interface PostGroup {
  key: string;
  title: string;
  icon?: string;
  description?: string;
  posts: PostMeta[];
}

export function getPostGroups(): PostGroup[] {
  const posts = getAllPosts();
  const map = new Map<string, PostMeta[]>();

  for (const post of posts) {
    const segs = post.slug.split("/");
    // Group by the first two segments when they exist (notes/deep-learning),
    // otherwise by the first segment alone (articles, blog, tutorials).
    // Special case for blog: all content under blog goes to the same "blog" group
    let key: string;
    if (segs[0] === "blog") {
      key = "blog";
    } else if (segs.length >= 3 && segs[0] === "notes") {
      key = `${segs[0]}/${segs[1]}`;
    } else if (segs.length >= 3) {
      key = `${segs[0]}/${segs[1]}`;
    } else {
      key = segs[0];
    }

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(post);
  }

  return Array.from(map.entries())
    .map(([key, items]) => {
      const meta = GROUP_TITLES[key] ?? { title: key };
      return {
        key,
        title: meta.title,
        icon: meta.icon,
        description: meta.description,
        // Posts within a group sorted by date asc (so chapter 0 → 7 reads naturally).
        posts: items
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN")),
      };
    })
    .sort((a, b) => b.posts.length - a.posts.length);
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

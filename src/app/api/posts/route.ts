import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

function getFilesRecursively(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else if (/\.mdx?$/.test(file) && file !== '_index.md') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

export async function GET() {
  const CONTENT_DIR = path.join(process.cwd(), 'content/posts');
  const files = getFilesRecursively(CONTENT_DIR);
  
  const posts = files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    const slug = path.relative(CONTENT_DIR, filePath).replace(/\.mdx?$/, '');
    const date = frontmatter.date ? new Date(frontmatter.date).toISOString().split('T')[0] : '1970-01-01';
    
    return {
      slug,
      title: frontmatter.title || 'Untitled',
      summary: frontmatter.description || '',
      date,
      tags: frontmatter.tags || [],
      categories: frontmatter.categories || []
    };
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  
  const latestPost = posts[0] || null;
  
  return NextResponse.json({ posts, latestPost });
}

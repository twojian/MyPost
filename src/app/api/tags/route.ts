import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { requireAdmin } from '@/lib/auth';

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');

// 删除标签：从所有文章中移除该标签
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    
    const { tagName } = await request.json();
    
    if (!tagName) {
      return NextResponse.json({ error: '标签名称不能为空' }, { status: 400 });
    }

    // 遍历所有文章，移除标签
    const files = getFilesRecursively(CONTENT_DIR);
    let updatedCount = 0;

    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      
      if (data.tags && Array.isArray(data.tags)) {
        const originalTags = [...data.tags];
        data.tags = data.tags.filter((t: string) => t !== tagName);
        
        // 只有标签发生变化时才更新
        if (JSON.stringify(originalTags) !== JSON.stringify(data.tags)) {
          const newContent = matter.stringify(content, data);
          fs.writeFileSync(filePath, newContent, 'utf-8');
          updatedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, updatedCount });
  } catch (error) {
    return NextResponse.json(
      { error: '删除标签失败' },
      { status: 500 }
    );
  }
}

// 重命名标签：更新所有文章中的标签名
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    
    const { oldName, newName } = await request.json();
    
    if (!oldName || !newName) {
      return NextResponse.json({ error: '标签名称不能为空' }, { status: 400 });
    }

    // 遍历所有文章，替换标签名
    const files = getFilesRecursively(CONTENT_DIR);
    let updatedCount = 0;

    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      
      if (data.tags && Array.isArray(data.tags)) {
        const originalTags = [...data.tags];
        data.tags = data.tags.map((t: string) => t === oldName ? newName : t);
        
        // 只有标签发生变化时才更新
        if (JSON.stringify(originalTags) !== JSON.stringify(data.tags)) {
          const newContent = matter.stringify(content, data);
          fs.writeFileSync(filePath, newContent, 'utf-8');
          updatedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, updatedCount });
  } catch (error) {
    return NextResponse.json(
      { error: '重命名标签失败' },
      { status: 500 }
    );
  }
}

function getFilesRecursively(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return getFilesRecursively(fullPath);
    if (/\.mdx?$/.test(entry.name) && entry.name !== '_index.md')
      return [fullPath];
    return [];
  });
}

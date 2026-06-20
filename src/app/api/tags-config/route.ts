import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'config', 'tags.json');

export async function GET() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return NextResponse.json(JSON.parse(data));
    } else {
      // 返回默认配置
      return NextResponse.json({
        groups: [],
        uncategorized: { name: '其他', description: '未分类的标签' },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read tags config' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const config = await request.json();
    
    // 确保 config 目录存在
    const configDir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // 写入配置文件
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save tags config' },
      { status: 500 }
    );
  }
}

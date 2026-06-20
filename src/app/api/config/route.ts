import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const configPath = path.join(process.cwd(), 'config/layout.json');
  const siteConfigPath = path.join(process.cwd(), 'config/site.json');
  
  let layout = {};
  let siteConfig = {
    banner: { type: 'image', image: '/images/welcome-banner.svg', video: '' },
    hero: { greeting: 'Good day! 👋', name: 'Twojian', description: '' },
    tags: {},
    tagOrder: []
  };
  
  if (fs.existsSync(configPath)) {
    const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const cards = data.cards ?? [];
    layout = {};
    for (const c of cards) layout[c.id] = c;
  }
  
  if (fs.existsSync(siteConfigPath)) {
    siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf-8'));
  }
  
  return NextResponse.json({ layout, siteConfig });
}

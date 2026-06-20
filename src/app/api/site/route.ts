import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { requireAdmin } from '@/lib/auth'
import { SiteConfigSchema } from '@/lib/validation'

const CONFIG_PATH = path.join(process.cwd(), 'config/site.json')

function readSiteConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return {
      banner: { image: '/images/welcome-banner.svg' },
      hero: { greeting: 'Good day! 👋', name: 'Twojian', description: '' },
      tags: {},
    }
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
}

export async function GET() {
  return Response.json(readSiteConfig())
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = SiteConfigSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: '验证失败', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(parsed.data, null, 2), 'utf-8')
  return Response.json({ ok: true })
}

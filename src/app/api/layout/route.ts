import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { requireAdmin } from '@/lib/auth'
import { LayoutConfigSchema } from '@/lib/validation'

const CONFIG_PATH = path.join(process.cwd(), 'config/layout.json')

function readLayout() {
  if (!fs.existsSync(CONFIG_PATH)) return { cards: [] }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
}

export async function GET() {
  return Response.json(readLayout())
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = LayoutConfigSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: '验证失败', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(parsed.data, null, 2), 'utf-8')
  return Response.json({ ok: true })
}

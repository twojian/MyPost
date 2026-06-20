import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { requireAdmin } from '@/lib/auth'
import { PostUpdateSchema } from '@/lib/validation'

const CONTENT_DIR = path.join(process.cwd(), 'content/posts')

function resolveFile(slug: string): string | null {
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`)
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`)
  if (fs.existsSync(mdxPath)) return mdxPath
  if (fs.existsSync(mdPath)) return mdPath
  return null
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const slugStr = slug.join('/')
  const filePath = resolveFile(slugStr)
  if (!filePath) {
    return Response.json({ error: '文章不存在' }, { status: 404 })
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return Response.json({ frontmatter: data, content })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    await requireAdmin()
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const slugStr = slug.join('/')
  const filePath = resolveFile(slugStr)
  if (!filePath) {
    return Response.json({ error: '文章不存在' }, { status: 404 })
  }

  const body = await request.json()
  const parsed = PostUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: '验证失败', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: existing, content: existingContent } = matter(raw)

  const updated = { ...existing }
  if (parsed.data.title !== undefined) updated.title = parsed.data.title
  if (parsed.data.date !== undefined) updated.date = parsed.data.date
  if (parsed.data.summary !== undefined) updated.summary = parsed.data.summary
  if (parsed.data.categories !== undefined) updated.categories = parsed.data.categories
  if (parsed.data.tags !== undefined) updated.tags = parsed.data.tags
  if (parsed.data.draft !== undefined) updated.draft = parsed.data.draft

  const newContent = parsed.data.content ?? existingContent
  const output = matter.stringify(newContent, updated)
  fs.writeFileSync(filePath, output, 'utf-8')

  return Response.json({ ok: true, slug: slugStr })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    await requireAdmin()
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const slugStr = slug.join('/')
  const filePath = resolveFile(slugStr)
  if (!filePath) {
    return Response.json({ error: '文章不存在' }, { status: 404 })
  }

  fs.unlinkSync(filePath)
  return Response.json({ ok: true })
}

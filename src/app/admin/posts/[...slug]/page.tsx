import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PostEditor from '@/components/admin/PostEditor'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string[] }>
}

async function fetchPost(slug: string) {
  const fs = await import('fs')
  const path = await import('path')
  const matter = (await import('gray-matter')).default

  const CONTENT_DIR = path.join(process.cwd(), 'content/posts')
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`)
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    title: data.title ?? '',
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
    summary: data.summary ?? data.description ?? '',
    categories: data.categories ?? [],
    tags: data.tags ?? [],
    draft: data.draft ?? false,
    content,
  }
}

export default async function EditPostPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { slug } = await params
  const slugStr = slug.join('/')
  const post = await fetchPost(slugStr)

  if (!post) {
    return (
      <div className="py-20 text-center">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:text-[var(--color-brand)] transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          返回文章管理
        </Link>
        <h1 className="text-xl font-bold">文章不存在</h1>
        <p className="mt-2 text-[var(--color-secondary)]">路径: {slugStr}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:text-[var(--color-brand)] transition-colors"
      >
        <ArrowLeft size={16} />
        返回文章管理
      </Link>
      <PostEditor mode="edit" slug={slugStr} initial={post} />
    </div>
  )
}

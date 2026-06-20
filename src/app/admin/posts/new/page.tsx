import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PostEditor from '@/components/admin/PostEditor'
import { ArrowLeft } from 'lucide-react'

export default async function NewPostPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="space-y-6">
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:text-[var(--color-brand)] transition-colors"
      >
        <ArrowLeft size={16} />
        返回文章管理
      </Link>
      <PostEditor mode="create" />
    </div>
  )
}

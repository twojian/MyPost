import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllTags } from '@/lib/posts'
import SiteEditor from './SiteEditor'
import { ArrowLeft } from 'lucide-react'

export default async function AdminSitePage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const tags = getAllTags()

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:text-[var(--color-brand)] transition-colors"
      >
        <ArrowLeft size={16} />
        返回管理面板
      </Link>
      <SiteEditor initialTags={tags} />
    </div>
  )
}

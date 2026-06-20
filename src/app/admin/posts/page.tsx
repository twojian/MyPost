import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DeleteButton } from './DeleteButton'
import { ArrowLeft } from 'lucide-react'

export default async function AdminPostsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const posts = getAllPosts()

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-secondary)] hover:text-[var(--color-brand)] transition-colors"
      >
        <ArrowLeft size={16} />
        返回管理面板
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          + 新建文章
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 font-medium">标题</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">分类</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">日期</th>
              <th className="px-4 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts/${post.slug}`}
                    className="font-medium text-[var(--color-primary)] hover:text-[var(--color-brand)]"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-[var(--color-secondary)]">
                    {post.slug}
                  </p>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {post.categories[0] ?? '-'}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-[var(--color-secondary)] md:table-cell">
                  {post.date}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="rounded px-2 py-1 text-xs text-[var(--color-secondary)] hover:bg-gray-100"
                      target="_blank"
                    >
                      查看
                    </Link>
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="rounded px-2 py-1 text-xs text-[var(--color-brand)] hover:bg-gray-100"
                    >
                      编辑
                    </Link>
                    <DeleteButton slug={post.slug} title={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

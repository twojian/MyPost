import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllPosts, getPostGroups } from '@/lib/posts'
import { LogoutButton } from './LogoutButton'

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const posts = getAllPosts()
  const groups = getPostGroups()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">管理面板</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--color-secondary)]">
            {session.email}
          </span>
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="文章总数" value={posts.length} />
        <StatCard label="分组数" value={groups.length} />
        <StatCard
          label="草稿"
          value={0}
          note="(不含已发布)"
        />
        <StatCard
          label="标签数"
          value={new Set(posts.flatMap((p) => p.tags)).size}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">快速操作</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionLink href="/admin/posts/new" label="新建文章" icon="+" />
            <ActionLink href="/admin/posts" label="管理文章" icon="📄" />
            <ActionLink href="/admin/groups" label="管理分组" icon="📁" />
            <ActionLink href="/admin/tags-groups" label="标签分组" icon="🏷️" />
            <ActionLink href="/admin/layout-editor" label="编辑布局" icon="🎨" />
            <ActionLink href="/admin/site" label="站点配置" icon="⚙️" />
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="mb-4 text-lg font-semibold">最近文章</h2>
          <ul className="space-y-2">
            {posts.slice(0, 5).map((post) => (
              <li key={post.slug} className="flex items-center justify-between text-sm">
                <Link
                  href={`/admin/posts/${post.slug}`}
                  className="truncate text-[var(--color-brand)] hover:underline"
                >
                  {post.title}
                </Link>
                <span className="ml-2 shrink-0 text-[var(--color-secondary)]">
                  {post.date}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value, note }: { label: string; value: number; note?: string }) {
  return (
    <div className="glass-card p-4">
      <p className="text-sm text-[var(--color-secondary)]">{label}</p>
      <p className="text-2xl font-bold">
        {value}
        {note && <span className="ml-1 text-xs font-normal text-[var(--color-secondary)]">{note}</span>}
      </p>
    </div>
  )
}

function ActionLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
    >
      <span>{icon}</span>
      {label}
    </Link>
  )
}

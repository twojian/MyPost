'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`确定要删除「${title}」吗？此操作不可撤销。`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error ?? '删除失败')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? '...' : '删除'}
    </button>
  )
}

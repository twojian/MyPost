'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface PostEditorProps {
  mode: 'create' | 'edit'
  slug?: string
  initial?: {
    title: string
    date: string
    summary: string
    categories: string[]
    tags: string[]
    draft: boolean
    content: string
  }
}

export default function PostEditor({ mode, slug, initial }: PostEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [title, setTitle] = useState(initial?.title ?? '')
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().split('T')[0])
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [categories, setCategories] = useState(initial?.categories?.join(', ') ?? '')
  const [tags, setTags] = useState(initial?.tags?.join(', ') ?? '')
  const [draft, setDraft] = useState(initial?.draft ?? false)
  const [content, setContent] = useState(initial?.content ?? '')
  const [newSlug, setNewSlug] = useState(slug ?? '')

  const handleSave = useCallback(async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    const body = {
      title,
      date,
      summary,
      categories: categories.split(',').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      draft,
      content,
      ...(mode === 'create' ? { slug: newSlug } : {}),
    }

    try {
      const url = mode === 'create' ? '/api/posts' : `/api/posts/${slug}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        const details = data.details
          ? Object.entries(data.details)
              .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
              .join('\n')
          : ''
        setError(data.error + (details ? '\n' + details : ''))
        return
      }

      setSuccess('保存成功')
      if (mode === 'create') {
        router.push(`/admin/posts/${data.slug}`)
      } else {
        router.refresh()
      }
    } catch {
      setError('网络错误')
    } finally {
      setSaving(false)
    }
  }, [title, date, summary, categories, tags, draft, content, newSlug, mode, slug, router])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? '新建文章' : '编辑文章'}
        </h1>
        <div className="flex items-center gap-3">
          {success && (
            <span className="text-sm text-green-600">{success}</span>
          )}
          {error && (
            <span className="max-w-xs truncate text-sm text-red-500">{error}</span>
          )}
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
          >
            返回
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Editor */}
        <div className="space-y-4">
          <div className="glass-card overflow-hidden" data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(v) => setContent(v ?? '')}
              height={600}
              preview="live"
              visibleDragbar={false}
            />
          </div>
        </div>

        {/* Frontmatter sidebar */}
        <div className="space-y-4">
          <div className="glass-card space-y-4 p-5">
            <h2 className="text-sm font-semibold text-[var(--color-secondary)]">
              文章属性
            </h2>

            {mode === 'create' && (
              <Field label="Slug (路径)">
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="tutorials/my-post"
                  className="input-field"
                />
                <p className="mt-1 text-xs text-[var(--color-secondary)]">
                  格式: 分类/文件名，如 notes/deep-learning/chapter-1
                </p>
              </Field>
            )}

            <Field label="标题">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
            </Field>

            <Field label="日期">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </Field>

            <Field label="摘要">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="input-field resize-none"
              />
            </Field>

            <Field label="分类 (逗号分隔)">
              <input
                type="text"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                placeholder="技术, 教程"
                className="input-field"
              />
            </Field>

            <Field label="标签 (逗号分隔)">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, Next.js, MDX"
                className="input-field"
              />
            </Field>

            <Field label="">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft}
                  onChange={(e) => setDraft(e.target.checked)}
                  className="rounded"
                />
                草稿 (不公开显示)
              </label>
            </Field>
          </div>

          {mode === 'edit' && slug && (
            <div className="glass-card p-5">
              <h2 className="mb-2 text-sm font-semibold text-[var(--color-secondary)]">
                信息
              </h2>
              <p className="text-xs text-[var(--color-secondary)]">
                路径: <code className="rounded bg-gray-100 px-1">{slug}</code>
              </p>
              <a
                href={`/posts/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-[var(--color-brand)] hover:underline"
              >
                在新标签页查看文章 →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">
          {label}
        </label>
      )}
      {children}
    </div>
  )
}

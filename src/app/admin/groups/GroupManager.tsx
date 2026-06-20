'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Group {
  key: string
  title: string
  icon: string
  description: string
}

export default function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    fetch('/api/groups')
      .then((r) => r.json())
      .then((data) => { setGroups(data); setLoading(false) })
  }, [])

  const save = useCallback(async (updated: Group[]) => {
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/groups', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    if (res.ok) {
      setMessage('已保存')
      setTimeout(() => setMessage(''), 2000)
    } else {
      const d = await res.json()
      setMessage('保存失败: ' + (d.error ?? ''))
    }
    setSaving(false)
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = groups.findIndex((g) => g.key === active.id)
    const newIndex = groups.findIndex((g) => g.key === over.id)
    const updated = arrayMove(groups, oldIndex, newIndex)
    setGroups(updated)
    save(updated)
  }

  function handleUpdate(key: string, field: keyof Group, value: string) {
    setGroups((prev) => prev.map((g) => (g.key === key ? { ...g, [field]: value } : g)))
  }

  function handleSaveEdit(key: string) {
    setEditing(null)
    save(groups)
  }

  function handleDelete(key: string) {
    const group = groups.find((g) => g.key === key)
    if (!confirm(`确定删除分组「${group?.title}」？`)) return
    const updated = groups.filter((g) => g.key !== key)
    setGroups(updated)
    save(updated)
  }

  function handleAdd(group: Group) {
    if (groups.some((g) => g.key === group.key)) {
      setMessage('分组 key 已存在')
      return
    }
    const updated = [...groups, group]
    setGroups(updated)
    save(updated)
    setAdding(false)
  }

  if (loading) return <div className="py-20 text-center text-[var(--color-secondary)]">加载中...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">分组管理</h1>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm ${message.startsWith('保存失败') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </span>
          )}
          <button
            onClick={() => setAdding(true)}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            + 新建分组
          </button>
        </div>
      </div>

      <p className="text-sm text-[var(--color-secondary)]">
        拖拽排序 · 点击编辑 · 改动自动保存
      </p>

      {adding && (
        <AddGroupForm
          onAdd={handleAdd}
          onCancel={() => setAdding(false)}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={groups.map((g) => g.key)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {groups.map((group) => (
              <SortableGroupItem
                key={group.key}
                group={group}
                isEditing={editing === group.key}
                onEdit={() => setEditing(group.key)}
                onSave={() => handleSaveEdit(group.key)}
                onUpdate={(field, value) => handleUpdate(group.key, field, value)}
                onDelete={() => handleDelete(group.key)}
                saving={saving}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function SortableGroupItem({
  group,
  isEditing,
  onEdit,
  onSave,
  onUpdate,
  onDelete,
  saving,
}: {
  group: Group
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onUpdate: (field: keyof Group, value: string) => void
  onDelete: () => void
  saving: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.key,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="glass-card p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">Key</label>
            <input value={group.key} disabled className="input-field bg-gray-100 opacity-60" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">标题</label>
            <input
              value={group.title}
              onChange={(e) => onUpdate('title', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">图标</label>
            <input
              value={group.icon}
              onChange={(e) => onUpdate('icon', e.target.value)}
              className="input-field"
              maxLength={4}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">描述</label>
            <input
              value={group.description}
              onChange={(e) => onUpdate('description', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={onDelete}
            className="rounded px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
          >
            删除
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded bg-[var(--color-brand)] px-3 py-1.5 text-xs text-white disabled:opacity-50"
          >
            完成
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card flex items-center gap-3 p-4"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
        title="拖拽排序"
      >
        ⠿
      </button>
      <span className="text-xl">{group.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{group.title}</p>
        <p className="truncate text-xs text-[var(--color-secondary)]">
          {group.key} · {group.description || '无描述'}
        </p>
      </div>
      <button
        onClick={onEdit}
        className="shrink-0 rounded px-3 py-1.5 text-xs text-[var(--color-brand)] hover:bg-gray-100"
      >
        编辑
      </button>
    </div>
  )
}

function AddGroupForm({
  onAdd,
  onCancel,
}: {
  onAdd: (group: Group) => void
  onCancel: () => void
}) {
  const [key, setKey] = useState('')
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!key || !title) return
    onAdd({ key, title, icon, description })
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-3 p-4">
      <h3 className="text-sm font-semibold">新建分组</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">Key</label>
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="notes/new-topic"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">标题</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="新分组名称"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">图标</label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="📚"
            className="input-field"
            maxLength={4}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">描述</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简短描述"
            className="input-field"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-3 py-1.5 text-xs">
          取消
        </button>
        <button type="submit" className="rounded bg-[var(--color-brand)] px-3 py-1.5 text-xs text-white">
          添加
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface Card {
  id: string
  x: number
  y: number
  w: number
  h: number
  visible: boolean
}

const CARD_LABELS: Record<string, string> = {
  nav: '导航卡片',
  banner: 'Banner',
  hero: '个人介绍',
  clock: '时钟',
  'latest-post': '最新文章',
  social: '社交链接',
  calendar: '日历',
  'random-post': '随机推荐',
  music: '音乐播放器',
}

const CANVAS_W = 1000
const CANVAS_H = 660

export default function LayoutEditor() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null)
  const [resizing, setResizing] = useState<{ id: string; startX: number; startY: number; startW: number; startH: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/layout')
      .then((r) => r.json())
      .then((data) => { setCards(data.cards ?? []); setLoading(false) })
  }, [])

  const save = useCallback(async (updated: Card[]) => {
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/layout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards: updated }),
    })
    if (res.ok) {
      setMessage('已保存')
      setTimeout(() => setMessage(''), 2000)
    } else {
      setMessage('保存失败')
    }
    setSaving(false)
  }, [])

  function getCanvasScale() {
    if (!canvasRef.current) return 1
    return canvasRef.current.clientWidth / CANVAS_W
  }

  function handleMouseDown(e: React.MouseEvent, card: Card) {
    e.stopPropagation()
    setSelected(card.id)
    const scale = getCanvasScale()
    const rect = canvasRef.current!.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / scale
    const mouseY = (e.clientY - rect.top) / scale
    setDragging({ id: card.id, offsetX: mouseX - card.x, offsetY: mouseY - card.y })
  }

  function handleResizeStart(e: React.MouseEvent, card: Card) {
    e.stopPropagation()
    e.preventDefault()
    setSelected(card.id)
    setResizing({ id: card.id, startX: e.clientX, startY: e.clientY, startW: card.w, startH: card.h })
  }

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (dragging) {
        const scale = getCanvasScale()
        const rect = canvasRef.current!.getBoundingClientRect()
        const mouseX = (e.clientX - rect.left) / scale
        const mouseY = (e.clientY - rect.top) / scale
        let newX = Math.round(mouseX - dragging.offsetX)
        let newY = Math.round(mouseY - dragging.offsetY)
        newX = Math.max(0, Math.min(newX, CANVAS_W - 60))
        newY = Math.max(0, Math.min(newY, CANVAS_H - 40))
        setCards((prev) => prev.map((c) => (c.id === dragging.id ? { ...c, x: newX, y: newY } : c)))
      }
      if (resizing) {
        const scale = getCanvasScale()
        const dx = (e.clientX - resizing.startX) / scale
        const dy = (e.clientY - resizing.startY) / scale
        const newW = Math.max(60, Math.round(resizing.startW + dx))
        const newH = Math.max(40, Math.round(resizing.startH + dy))
        setCards((prev) => prev.map((c) => (c.id === resizing.id ? { ...c, w: newW, h: newH } : c)))
      }
    }

    function handleMouseUp() {
      if (dragging || resizing) {
        setDragging(null)
        setResizing(null)
        setCards((prev) => {
          save(prev)
          return prev
        })
      }
    }

    if (dragging || resizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, resizing, save])

  function handleToggleVisible(id: string) {
    const updated = cards.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    setCards(updated)
    save(updated)
  }

  function handleInputChange(id: string, field: 'x' | 'y' | 'w' | 'h', value: number) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  function handleInputBlur() {
    save(cards)
  }

  if (loading) return <div className="py-20 text-center text-[var(--color-secondary)]">加载中...</div>

  const selectedCard = cards.find((c) => c.id === selected)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">布局编辑器</h1>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm ${message === '保存失败' ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </span>
          )}
          {saving && <span className="text-sm text-[var(--color-secondary)]">保存中...</span>}
        </div>
      </div>

      <p className="text-sm text-[var(--color-secondary)]">
        拖拽移动卡片 · 右下角手柄调整大小 · 点击选中查看属性
      </p>

      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        {/* Canvas */}
        <div className="glass-card overflow-hidden p-4">
          <div
            ref={canvasRef}
            className="relative mx-auto border border-dashed border-gray-300 bg-white/30"
            style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, maxWidth: CANVAS_W }}
            onClick={() => setSelected(null)}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`absolute flex cursor-move select-none flex-col items-center justify-center rounded-xl border-2 text-xs font-medium transition-shadow ${
                  selected === card.id
                    ? 'border-[var(--color-brand)] shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                } ${card.visible ? 'bg-white/70' : 'bg-gray-200/50 opacity-50'}`}
                style={{
                  left: `${(card.x / CANVAS_W) * 100}%`,
                  top: `${(card.y / CANVAS_H) * 100}%`,
                  width: `${(card.w / CANVAS_W) * 100}%`,
                  height: `${(card.h / CANVAS_H) * 100}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, card)}
              >
                <span className="pointer-events-none text-center leading-tight">
                  {CARD_LABELS[card.id] ?? card.id}
                </span>
                <span className="pointer-events-none mt-0.5 text-[10px] text-[var(--color-secondary)]">
                  {card.w}×{card.h}
                </span>
                {/* Resize handle */}
                <div
                  className="absolute bottom-0 right-0 h-3 w-3 cursor-se-resize rounded-tl bg-[var(--color-brand)] opacity-0 transition-opacity hover:opacity-100"
                  style={{ opacity: selected === card.id ? 0.8 : undefined }}
                  onMouseDown={(e) => handleResizeStart(e, card)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Properties panel */}
        <div className="space-y-4">
          {selectedCard ? (
            <div className="glass-card space-y-3 p-4">
              <h3 className="text-sm font-semibold">{CARD_LABELS[selectedCard.id] ?? selectedCard.id}</h3>
              <div className="grid grid-cols-2 gap-2">
                {(['x', 'y', 'w', 'h'] as const).map((field) => (
                  <div key={field}>
                    <label className="mb-0.5 block text-xs text-[var(--color-secondary)]">
                      {field.toUpperCase()}
                    </label>
                    <input
                      type="number"
                      value={selectedCard[field]}
                      onChange={(e) => handleInputChange(selectedCard.id, field, Number(e.target.value))}
                      onBlur={handleInputBlur}
                      className="input-field text-center"
                    />
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCard.visible}
                  onChange={() => handleToggleVisible(selectedCard.id)}
                />
                显示
              </label>
            </div>
          ) : (
            <div className="glass-card p-4 text-center text-sm text-[var(--color-secondary)]">
              点击画布中的卡片查看属性
            </div>
          )}

          <div className="glass-card space-y-2 p-4">
            <h3 className="text-sm font-semibold">全部卡片</h3>
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelected(card.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  selected === card.id
                    ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className={card.visible ? '' : 'line-through opacity-50'}>
                  {CARD_LABELS[card.id] ?? card.id}
                </span>
                <span className="text-[var(--color-secondary)]">
                  {card.w}×{card.h}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { SiteConfig, TagConfig } from '@/lib/validation';

interface TagData {
  name: string;
  count: number;
}

interface SiteEditorProps {
  initialTags: TagData[];
}

export default function SiteEditor({ initialTags }: SiteEditorProps) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'banner' | 'tags'>('hero');
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [deletingTag, setDeletingTag] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<'config' | 'alphabetical' | 'count'>('config');

  useEffect(() => {
    fetch('/api/site')
      .then((r) => r.json())
      .then((data) => { setConfig(data); setLoading(false); });
  }, []);

  const save = useCallback(async (updated: SiteConfig) => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      setMessage('已保存');
      setTimeout(() => setMessage(''), 2000);
    } else {
      const d = await res.json();
      setMessage('保存失败: ' + (d.error ?? ''));
    }
    setSaving(false);
  }, []);

  const handleHeroChange = (field: keyof SiteConfig['hero'], value: string) => {
    if (!config) return;
    const updated = { ...config, hero: { ...config.hero, [field]: value } };
    setConfig(updated);
  };

  const handleBannerTypeChange = (type: 'image' | 'video') => {
    if (!config) return;
    const updated = { ...config, banner: { ...config.banner, type } };
    setConfig(updated);
  };

  const handleBannerChange = (field: 'image' | 'video', value: string) => {
    if (!config) return;
    const updated = { ...config, banner: { ...config.banner, [field]: value } };
    setConfig(updated);
  };

  const handleTagChange = (tagName: string, field: keyof TagConfig, value: string) => {
    if (!config) return;
    const updatedTags = { ...config.tags };
    if (!updatedTags[tagName]) {
      updatedTags[tagName] = { name: tagName, color: '', description: '' };
    }
    updatedTags[tagName] = { ...updatedTags[tagName], [field]: value };
    const updated = { ...config, tags: updatedTags };
    setConfig(updated);
  };

  const handleMoveTag = (fromIndex: number, direction: 'up' | 'down') => {
    if (!config) return;
    const tagOrder = [...(config.tagOrder || [])];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= tagOrder.length) return;
    
    [tagOrder[fromIndex], tagOrder[toIndex]] = [tagOrder[toIndex], tagOrder[fromIndex]];
    setConfig({ ...config, tagOrder });
  };

  const handleSave = () => {
    if (config) save(config);
  };

  const handleDeleteTag = async () => {
    if (!deletingTag || !config) return;
    
    try {
      const res = await fetch('/api/tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagName: deletingTag }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessage(`已删除标签「${deletingTag}」，更新了 ${data.updatedCount} 篇文章`);
        
        // 清除已删除的标签配置
        const updatedTags = { ...config.tags };
        delete updatedTags[deletingTag];
        
        const updatedTagOrder = config.tagOrder?.filter(t => t !== deletingTag) || [];
        
        setConfig({ ...config, tags: updatedTags, tagOrder: updatedTagOrder });
        setDeletingTag(null);
        
        // 刷新页面来更新标签列表
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      setMessage('删除标签失败');
    }
  };

  const handleRenameTag = async () => {
    if (!editingTagName || !newTagName || !config) return;
    
    if (initialTags.find(t => t.name === newTagName)) {
      setMessage('标签名已存在');
      return;
    }
    
    try {
      const res = await fetch('/api/tags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName: editingTagName, newName: newTagName }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessage(`已将标签「${editingTagName}」重命名为「${newTagName}」，更新了 ${data.updatedCount} 篇文章`);
        
        // 更新配置
        const updatedTags = { ...config.tags };
        if (updatedTags[editingTagName]) {
          updatedTags[newTagName] = { ...updatedTags[editingTagName], name: newTagName };
          delete updatedTags[editingTagName];
        }
        
        const updatedTagOrder = config.tagOrder?.map(t => t === editingTagName ? newTagName : t) || [];
        
        setConfig({ ...config, tags: updatedTags, tagOrder: updatedTagOrder });
        setEditingTagName(null);
        setNewTagName('');
        
        // 刷新页面来更新标签列表
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      setMessage('重命名标签失败');
    }
  };

  // 获取排序后的标签
  const getSortedTags = () => {
    let tags = [...initialTags];
    
    // 确保所有标签都在 tagOrder 中
    if (config) {
      const tagOrder = config.tagOrder || [];
      const currentTags = tags.map(t => t.name);
      const newOrder = tagOrder.filter(t => currentTags.includes(t));
      
      // 添加不在 order 中的标签
      currentTags.forEach(t => {
        if (!newOrder.includes(t)) newOrder.push(t);
      });
      
      // 更新配置
      if (JSON.stringify(tagOrder) !== JSON.stringify(newOrder)) {
        setConfig({ ...config, tagOrder: newOrder });
      }
      
      // 根据选择的模式排序
      switch (sortMode) {
        case 'config':
          const orderMap = new Map<string, number>();
          newOrder.forEach((name, index) => orderMap.set(name, index));
          tags.sort((a, b) => {
            const ai = orderMap.get(a.name) ?? 999;
            const bi = orderMap.get(b.name) ?? 999;
            return ai - bi;
          });
          break;
        case 'alphabetical':
          tags.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
          break;
        case 'count':
          tags.sort((a, b) => b.count - a.count);
          break;
      }
    }
    
    return tags;
  };

  if (loading) return <div className="py-20 text-center text-[var(--color-secondary)]">加载中...</div>;
  if (!config) return <div className="py-20 text-center text-[var(--color-secondary)]">加载失败</div>;

  const sortedTags = getSortedTags();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">站点配置</h1>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm ${message.startsWith('保存失败') || message.startsWith('删除') || message.startsWith('重命名') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'hero', label: '个人介绍' },
          { id: 'banner', label: 'Banner' },
          { id: 'tags', label: '标签' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[var(--color-brand)] text-[var(--color-brand)]'
                : 'border-transparent text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Editor */}
      {activeTab === 'hero' && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">个人介绍卡片</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-secondary)]">问候语</label>
              <input
                value={config.hero.greeting}
                onChange={(e) => handleHeroChange('greeting', e.target.value)}
                className="input-field"
                placeholder="Good day! 👋"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-secondary)]">名字</label>
              <input
                value={config.hero.name}
                onChange={(e) => handleHeroChange('name', e.target.value)}
                className="input-field"
                placeholder="Twojian"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-secondary)]">介绍</label>
              <textarea
                value={config.hero.description}
                onChange={(e) => handleHeroChange('description', e.target.value)}
                className="input-field resize-none"
                rows={4}
                placeholder="介绍一下自己..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Banner Editor */}
      {activeTab === 'banner' && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Banner 卡片</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-secondary)]">媒体类型</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBannerTypeChange('image')}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    config.banner.type === 'image'
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  图片
                </button>
                <button
                  onClick={() => handleBannerTypeChange('video')}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    config.banner.type === 'video'
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  视频
                </button>
              </div>
            </div>

            {config.banner.type === 'image' ? (
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-secondary)]">图片路径</label>
                <input
                  value={config.banner.image}
                  onChange={(e) => handleBannerChange('image', e.target.value)}
                  className="input-field"
                  placeholder="/images/welcome-banner.svg"
                />
                <p className="mt-1 text-xs text-[var(--color-secondary)]">
                  图片应放置在 public/images/ 目录下
                </p>
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--color-secondary)]">视频路径</label>
                <input
                  value={config.banner.video}
                  onChange={(e) => handleBannerChange('video', e.target.value)}
                  className="input-field"
                  placeholder="/videos/banner.mp4"
                />
                <p className="mt-1 text-xs text-[var(--color-secondary)]">
                  视频应放置在 public/videos/ 目录下，支持 MP4, WebM, OGG 格式
                </p>
              </div>
            )}

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-[var(--color-secondary)]">预览</label>
              <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-gray-200">
                {config.banner.type === 'video' ? (
                  <video
                    src={config.banner.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={config.banner.image}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tags Editor */}
      {activeTab === 'tags' && (
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">标签管理</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-secondary)]">排序方式：</span>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as any)}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="config">自定义排序</option>
                <option value="alphabetical">按字母</option>
                <option value="count">按数量</option>
              </select>
            </div>
          </div>

          <div>
            <p className="text-sm text-[var(--color-secondary)] mb-4">
              点击标签进行编辑，标签样式将与用户看到的保持一致
            </p>

            {sortedTags.length > 0 ? (
              <div className="space-y-3">
                {sortedTags.map((tag, index) => {
                  const tagConfig = config.tags[tag.name];
                  const bgColor = tagConfig?.color ? `${tagConfig.color}20` : 'rgba(53, 191, 171, 0.15)';
                  const textColor = tagConfig?.color || 'var(--color-brand)';
                  const isExpanded = expandedTag === tag.name;
                  const isEditingName = editingTagName === tag.name;

                  return (
                    <div key={tag.name} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* 标签卡片 */}
                      <div className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50">
                        {/* 排序按钮 */}
                        {sortMode === 'config' && (
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveTag(index, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:text-[var(--color-brand)] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleMoveTag(index, 'down')}
                              disabled={index === sortedTags.length - 1}
                              className="p-1 hover:text-[var(--color-brand)] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* 标签预览 */}
                        <button
                          onClick={() => setExpandedTag(isExpanded ? null : tag.name)}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                            style={{
                              background: bgColor,
                              color: textColor,
                            }}
                          >
                            # {tag.name}
                            <span
                              className="rounded-full px-1.5 py-0.5 text-xs"
                              style={{
                                background: tagConfig?.color
                                  ? `${tagConfig.color}40`
                                  : 'rgba(53, 191, 171, 0.2)'
                              }}
                            >
                              {tag.count}
                            </span>
                          </span>
                          {tagConfig?.description && (
                            <span className="text-xs text-[var(--color-secondary)]">
                              • {tagConfig.description}
                            </span>
                          )}
                        </button>

                        {/* 操作按钮 */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTagName(tag.name);
                              setNewTagName(tag.name);
                            }}
                            className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                            title="重命名"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeletingTag(tag.name)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="删除"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setExpandedTag(isExpanded ? null : tag.name)}
                            className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-brand)]"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* 编辑面板 */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">颜色</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={tagConfig?.color || '#35bfab'}
                                  onChange={(e) => handleTagChange(tag.name, 'color', e.target.value)}
                                  className="h-10 w-12 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={tagConfig?.color || ''}
                                  onChange={(e) => handleTagChange(tag.name, 'color', e.target.value)}
                                  className="input-field flex-1"
                                  placeholder="#35bfab"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-[var(--color-secondary)]">描述</label>
                              <input
                                value={tagConfig?.description || ''}
                                onChange={(e) => handleTagChange(tag.name, 'description', e.target.value)}
                                className="input-field"
                                placeholder="标签描述"
                              />
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-[var(--color-secondary)] mb-2">实时预览：</p>
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                              style={{
                                background: bgColor,
                                color: textColor,
                              }}
                            >
                              # {tag.name}
                              <span
                                className="rounded-full px-1.5 py-0.5 text-xs"
                                style={{
                                  background: tagConfig?.color
                                    ? `${tagConfig.color}40`
                                    : 'rgba(53, 191, 171, 0.2)'
                                }}
                              >
                                {tag.count}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-secondary)] py-8 text-center">暂无标签</p>
            )}
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      {deletingTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">确认删除</h3>
            <p className="text-[var(--color-secondary)] mb-6">
              确定要删除标签「{deletingTag}」吗？这将从所有文章中移除该标签。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingTag(null)}
                className="px-4 py-2 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
              >
                取消
              </button>
              <button
                onClick={handleDeleteTag}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重命名对话框 */}
      {editingTagName && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">重命名标签</h3>
            <p className="text-[var(--color-secondary)] mb-4">
              将标签「{editingTagName}」重命名为：
            </p>
            <input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="input-field mb-6"
              placeholder="输入新标签名"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setEditingTagName(null);
                  setNewTagName('');
                }}
                className="px-4 py-2 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
              >
                取消
              </button>
              <button
                onClick={handleRenameTag}
                disabled={!newTagName || newTagName === editingTagName}
                className="px-4 py-2 text-sm bg-[var(--color-brand)] text-white rounded hover:opacity-90 disabled:opacity-50"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

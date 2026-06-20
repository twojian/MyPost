'use client';

import { useState, useEffect } from 'react';

interface TagData {
  name: string;
  count: number;
}

interface TagConfig {
  name: string;
  color?: string;
}

interface TagGroup {
  id: string;
  name: string;
  description?: string;
  tags: TagConfig[];
}

interface TagsConfig {
  groups: TagGroup[];
  uncategorized: {
    name: string;
    description?: string;
  };
}

interface TagGroupManagerProps {
  initialTags: TagData[];
}

export default function TagGroupManager({ initialTags }: TagGroupManagerProps) {
  const [config, setConfig] = useState<TagsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingTagInGroup, setEditingTagInGroup] = useState<{ groupId: string; tagName: string } | null>(null);
  const [newGroup, setNewGroup] = useState<{ id: string; name: string; description: string }>({
    id: '',
    name: '',
    description: '',
  });
  const [showAddGroup, setShowAddGroup] = useState(false);

  useEffect(() => {
    fetch('/api/tags-config')
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => {
        // 如果没有配置文件，使用默认配置
        setConfig({
          groups: [],
          uncategorized: { name: '其他', description: '未分类的标签' },
        });
        setLoading(false);
      });
  }, []);

  const save = async (updated: TagsConfig) => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/tags-config', {
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
  };

  const handleAddGroup = () => {
    if (!newGroup.id || !newGroup.name) return;
    if (!config) return;
    const updated: TagsConfig = {
      ...config,
      groups: [...config.groups, { ...newGroup, tags: [] }],
    };
    setConfig(updated);
    save(updated);
    setNewGroup({ id: '', name: '', description: '' });
    setShowAddGroup(false);
  };

  const handleUpdateGroup = (groupId: string, field: keyof Omit<TagGroup, 'id' | 'tags'>, value: string) => {
    if (!config) return;
    const updated = {
      ...config,
      groups: config.groups.map((g) =>
        g.id === groupId ? { ...g, [field]: value } : g
      ),
    };
    setConfig(updated);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (!config) return;
    const group = config.groups.find((g) => g.id === groupId);
    if (!confirm(`确定删除分组「${group?.name}」？该分组下的标签将被移到未分类。`)) return;
    const updated = {
      ...config,
      groups: config.groups.filter((g) => g.id !== groupId),
    };
    setConfig(updated);
    save(updated);
  };

  const handleAddTagToGroup = (groupId: string, tagName: string) => {
    if (!config) return;
    // 先从其他分组移除该标签
    let tagToMove: TagConfig | undefined;
    const updatedGroups = config.groups.map((g) => {
      const tagIndex = g.tags.findIndex((t) => t.name === tagName);
      if (tagIndex !== -1) {
        tagToMove = g.tags[tagIndex];
        return { ...g, tags: g.tags.filter((t) => t.name !== tagName) };
      }
      return g;
    });
    // 添加到目标分组
    const finalGroups = updatedGroups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          tags: [...g.tags, tagToMove || { name: tagName }],
        };
      }
      return g;
    });
    const updated = { ...config, groups: finalGroups };
    setConfig(updated);
    save(updated);
  };

  const handleRemoveTagFromGroup = (groupId: string, tagName: string) => {
    if (!config) return;
    const updated = {
      ...config,
      groups: config.groups.map((g) =>
        g.id === groupId
          ? { ...g, tags: g.tags.filter((t) => t.name !== tagName) }
          : g
      ),
    };
    setConfig(updated);
    save(updated);
  };

  const handleUpdateTagConfig = (
    groupId: string,
    tagName: string,
    field: keyof TagConfig,
    value: string
  ) => {
    if (!config) return;
    const updated = {
      ...config,
      groups: config.groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              tags: g.tags.map((t) =>
                t.name === tagName ? { ...t, [field]: value } : t
              ),
            }
          : g
      ),
    };
    setConfig(updated);
  };

  const getUngroupedTags = () => {
    if (!config) return initialTags;
    const groupedTags = new Set(
      config.groups.flatMap((g) => g.tags.map((t) => t.name))
    );
    return initialTags.filter((t) => !groupedTags.has(t.name));
  };

  if (loading)
    return (
      <div className="py-20 text-center text-[var(--color-secondary)]">
        加载中...
      </div>
    );
  if (!config)
    return (
      <div className="py-20 text-center text-[var(--color-secondary)]">
        加载失败
      </div>
    );

  const ungroupedTags = getUngroupedTags();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">标签分组管理</h1>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`text-sm ${
                message.startsWith('保存失败') ? 'text-red-500' : 'text-green-600'
              }`}
            >
              {message}
            </span>
          )}
          <button
            onClick={() => setShowAddGroup(!showAddGroup)}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {showAddGroup ? '取消' : '+ 添加分组'}
          </button>
        </div>
      </div>

      {/* 添加分组表单 */}
      {showAddGroup && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">添加新分组</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-secondary)]">
                ID
              </label>
              <input
                value={newGroup.id}
                onChange={(e) => setNewGroup({ ...newGroup, id: e.target.value })}
                className="input-field"
                placeholder="例如: core, tools"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-secondary)]">
                名称
              </label>
              <input
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                className="input-field"
                placeholder="例如: 核心领域"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-secondary)]">
              描述
            </label>
            <input
              value={newGroup.description}
              onChange={(e) =>
                setNewGroup({ ...newGroup, description: e.target.value })
              }
              className="input-field"
              placeholder="分组的简短描述"
            />
          </div>
          <button
            onClick={handleAddGroup}
            disabled={!newGroup.id || !newGroup.name || saving}
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            保存
          </button>
        </div>
      )}

      {/* 现有分组 */}
      <div className="space-y-6">
        {config.groups.map((group) => (
          <div key={group.id} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              {editingGroup === group.id ? (
                <div className="flex-1 space-y-3">
                  <input
                    value={group.name}
                    onChange={(e) => handleUpdateGroup(group.id, 'name', e.target.value)}
                    className="input-field max-w-sm"
                    placeholder="分组名称"
                  />
                  <input
                    value={group.description || ''}
                    onChange={(e) =>
                      handleUpdateGroup(group.id, 'description', e.target.value)
                    }
                    className="input-field max-w-lg"
                    placeholder="分组描述"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGroup(null);
                        save(config);
                      }}
                      disabled={saving}
                      className="rounded-lg bg-[var(--color-brand)] px-3 py-1 text-sm text-white"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingGroup(null)}
                      className="rounded-lg border px-3 py-1 text-sm text-[var(--color-secondary)]"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-lg font-semibold">{group.name}</h2>
                    {group.description && (
                      <p className="text-sm text-[var(--color-secondary)]">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingGroup(group.id)}
                      className="p-2 text-blue-500 hover:text-blue-700"
                      title="编辑"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="删除"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 分组中的标签 */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => {
                  const bgColor = tag.color
                    ? `${tag.color}20`
                    : 'rgba(53, 191, 171, 0.15)';
                  const textColor = tag.color || 'var(--color-brand)';
                  const tagData = initialTags.find((t) => t.name === tag.name);
                  const isEditing =
                    editingTagInGroup?.groupId === group.id &&
                    editingTagInGroup?.tagName === tag.name;

                  return (
                    <div
                      key={tag.name}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
                    >
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                        style={{ background: bgColor, color: textColor }}
                      >
                        # {tag.name}
                        {tagData && (
                          <span
                            className="rounded-full px-1 text-[10px]"
                            style={{
                              background: tag.color
                                ? `${tag.color}40`
                                : 'rgba(53, 191, 171, 0.2)',
                            }}
                          >
                            {tagData.count}
                          </span>
                        )}
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={tag.color || '#35bfab'}
                            onChange={(e) =>
                              handleUpdateTagConfig(group.id, tag.name, 'color', e.target.value)
                            }
                            className="h-6 w-8 rounded cursor-pointer"
                          />
                          <button
                            onClick={() => {
                              setEditingTagInGroup(null);
                              save(config);
                            }}
                            className="text-xs text-green-600"
                          >
                            保存
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setEditingTagInGroup({ groupId: group.id, tagName: tag.name })
                            }
                            className="p-1 text-blue-500 hover:text-blue-700"
                            title="编辑标签"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveTagFromGroup(group.id, tag.name)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="移出分组"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 添加标签到分组 */}
              {ungroupedTags.length > 0 && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-[var(--color-secondary)]">
                    添加标签到此分组
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddTagToGroup(group.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="input-field max-w-sm"
                    defaultValue=""
                  >
                    <option value="">选择标签...</option>
                    {ungroupedTags.map((tag) => (
                      <option key={tag.name} value={tag.name}>
                        {tag.name} ({tag.count})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 未分类标签 */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{config.uncategorized.name}</h2>
            {config.uncategorized.description && (
              <p className="text-sm text-[var(--color-secondary)]">
                {config.uncategorized.description}
              </p>
            )}
          </div>
          {ungroupedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {ungroupedTags.map((tag) => (
                <span
                  key={tag.name}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                >
                  # {tag.name}
                  <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs">
                    {tag.count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-secondary)]">
              所有标签都已分类！
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

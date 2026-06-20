import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = { title: "标签" };

function loadSiteConfig() {
  const configPath = path.join(process.cwd(), "config/site.json");
  if (!fs.existsSync(configPath)) return { tags: {} };
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  return config;
}

function loadTagsConfig() {
  const configPath = path.join(process.cwd(), "config/tags.json");
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

type TagInfo = { name: string; count: number };
type TagConfig = { name: string; color?: string };
type TagGroup = {
  id: string;
  name: string;
  description?: string;
  tags: TagConfig[];
};

export default function TagsPage() {
  const tags = getAllTags();
  const siteConfig = loadSiteConfig();
  const tagsConfig = loadTagsConfig();

  // 创建标签到配置的映射
  const tagMap = new Map<string, { count: number; config?: any }>();
  tags.forEach((tag) => {
    tagMap.set(tag.name, { count: tag.count, config: siteConfig.tags?.[tag.name] });
  });

  // 按配置分组
  const groups: Array<{
    id: string;
    name: string;
    description?: string;
    tags: TagInfo[];
  }> = [];
  const handledTags = new Set<string>();

  if (tagsConfig && tagsConfig.groups) {
    tagsConfig.groups.forEach((group: TagGroup) => {
      const groupTags: TagInfo[] = [];
      group.tags.forEach((tagConfig) => {
        const tagInfo = tagMap.get(tagConfig.name);
        if (tagInfo) {
          groupTags.push({ name: tagConfig.name, count: tagInfo.count });
          handledTags.add(tagConfig.name);
        }
      });
      if (groupTags.length > 0) {
        groups.push({
          id: group.id,
          name: group.name,
          description: group.description,
          tags: groupTags,
        });
      }
    });
  }

  // 未分组的标签
  const ungroupedTags: TagInfo[] = [];
  tags.forEach((tag) => {
    if (!handledTags.has(tag.name)) {
      ungroupedTags.push(tag);
    }
  });

  if (ungroupedTags.length > 0) {
    groups.push({
      id: "uncategorized",
      name: tagsConfig?.uncategorized?.name || "其他",
      description: tagsConfig?.uncategorized?.description,
      tags: ungroupedTags,
    });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
        标签
      </h1>

      {groups.map((group) => (
        <section key={group.id} className="glass-card p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--color-primary)" }}>
              {group.name}
            </h2>
            {group.description && (
              <p className="text-sm" style={{ color: "var(--color-secondary)" }}>
                {group.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {group.tags.map((tag) => {
              const tagConfig = siteConfig.tags?.[tag.name];
              const groupConfig = tagsConfig?.groups
                ?.flatMap((g: TagGroup) => g.tags)
                ?.find((t: TagConfig) => t.name === tag.name);
              const color = tagConfig?.color || groupConfig?.color;
              const bgColor = color ? `${color}20` : "rgba(53, 191, 171, 0.15)";
              const textColor = color || "var(--color-brand)";

              return (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.name}`}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-transform hover:scale-105"
                  style={{
                    background: bgColor,
                    color: textColor,
                  }}
                >
                  # {tag.name}
                  <span
                    className="rounded-full px-1.5 py-0.5 text-xs"
                    style={{
                      background: color ? `${color}40` : "rgba(53, 191, 171, 0.2)",
                    }}
                  >
                    {tag.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {groups.length === 0 && (
        <p style={{ color: "var(--color-secondary)" }}>暂无标签</p>
      )}
    </div>
  );
}

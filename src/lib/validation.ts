import { z } from 'zod'

export const PostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式: YYYY-MM-DD'),
  summary: z.string().max(500).optional().default(''),
  categories: z.array(z.string()).min(1, '至少选择一个分类'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  content: z.string().min(1, '内容不能为空'),
})

export const PostUpdateSchema = PostSchema.partial().extend({
  content: z.string().min(1).optional(),
})

export const GroupSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1, '分组标题不能为空'),
  icon: z.string().max(4).optional().default(''),
  description: z.string().max(200).optional().default(''),
})

export const GroupsConfigSchema = z.array(GroupSchema)

export const CardLayoutSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number().min(60),
  h: z.number().min(40),
  visible: z.boolean().default(true),
})

export const LayoutConfigSchema = z.object({
  cards: z.array(CardLayoutSchema),
})

export const BannerConfigSchema = z.object({
  type: z.enum(['image', 'video']).default('image'),
  image: z.string().min(1, '图片路径不能为空').optional().default(''),
  video: z.string().min(1, '视频路径不能为空').optional().default(''),
})

export const HeroConfigSchema = z.object({
  greeting: z.string().max(100).optional().default('Good day! 👋'),
  name: z.string().max(100).optional().default('Twojian'),
  description: z.string().max(500).optional().default(''),
})

export const TagConfigSchema = z.object({
  name: z.string().min(1, '标签名称不能为空'),
  color: z.string().optional().default(''),
  description: z.string().max(200).optional().default(''),
})

export const SiteConfigSchema = z.object({
  banner: BannerConfigSchema,
  hero: HeroConfigSchema,
  tags: z.record(z.string(), TagConfigSchema).optional().default({}),
  tagOrder: z.array(z.string()).optional().default([]),
});

export type PostInput = z.infer<typeof PostSchema>
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>
export type GroupInput = z.infer<typeof GroupSchema>
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>
export type SiteConfig = z.infer<typeof SiteConfigSchema>
export type TagConfig = z.infer<typeof TagConfigSchema>

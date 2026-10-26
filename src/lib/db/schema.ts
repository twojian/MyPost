import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** 文章表：云数据库内容源的核心表 */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").unique().notNull(), // 路由标识，如 'blog/os-chapter-1'
    title: text("title").notNull(),
    date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
    tags: jsonb("tags").$type<string[]>().notNull().default([]), // ['深度学习','AIGC']
    excerpt: text("excerpt"), // 摘要，可空
    content_md: text("content_md").notNull(), // Markdown/MDX 正文（字符串）
    cover_url: text("cover_url"), // 封面图 URL，可空
    status: text("status").notNull().default("draft"), // draft | published
    publish_at: timestamp("publish_at", { withTimezone: true }), // 定时发布
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("posts_status_publish_idx").on(table.status, table.publish_at),
    index("posts_date_idx").on(table.date.desc()),
  ],
);

/** 文章历史版本表 */
export const postRevisions = pgTable("post_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  title: text("title"),
  contentMd: text("content_md"),
  tags: jsonb("tags").$type<string[]>().default([]),
  savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
});

/** 后台账号表 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(), // bcrypt
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type User = typeof users.$inferSelect;

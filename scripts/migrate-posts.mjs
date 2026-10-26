/**
 * 阶段1：迁移 content/posts 文章到 Neon 数据库
 *
 * 用法：
 *   node scripts/migrate-posts.mjs            # dry-run：解析+预检，输出 drizzle/migration-dryrun.json
 *   node scripts/migrate-posts.mjs --apply    # 正式迁移：写入 posts 表（status=published），输出报告
 *
 * 环境变量：DATABASE_URL（--apply 时需要）
 */
import fs from "node:fs";
import path from "node:path";
import grayMatter from "gray-matter";

const APPLY = process.argv.includes("--apply");
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "posts");

const mdImgRe = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
const htmlImgRe = /<img[^>]+src=["']([^"']+)["']/g;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(md|mdx)$/i.test(e.name)) out.push(p);
  }
  return out;
}

function collectImages(content) {
  const refs = [];
  let m;
  mdImgRe.lastIndex = 0;
  while ((m = mdImgRe.exec(content)) !== null) refs.push({ type: "md", alt: m[1], url: m[2] });
  htmlImgRe.lastIndex = 0;
  while ((m = htmlImgRe.exec(content)) !== null) refs.push({ type: "html", alt: "", url: m[1] });
  return refs;
}

function classifyImage(url, filePath) {
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return { kind: "absolute", url: u };
  if (u.startsWith("/")) return { kind: "public-like", url: u };
  if (/^(\.\.?\/|[a-zA-Z]:)/.test(u)) {
    const bare = u.split(/[?#]/)[0];
    const abs = path.resolve(path.dirname(filePath), bare);
    return { kind: "relative", url: u, abs, exists: fs.existsSync(abs) };
  }
  return { kind: "other", url: u };
}

const files = walk(CONTENT_DIR).sort();
const records = [];
const imageStats = { absolute: 0, publicLike: 0, relative: 0, relativeMissing: [], other: [] };

for (const f of files) {
  const rel = path.relative(CONTENT_DIR, f).replace(/\\/g, "/");
  const slug = rel.replace(/\.(md|mdx)$/i, "");
  const raw = fs.readFileSync(f, "utf8");
  let meta, content;
  try {
    const parsed = grayMatter(raw);
    meta = parsed.data;
    content = parsed.content;
  } catch (e) {
    console.error(`[FAIL] ${slug}: frontmatter 解析失败 - ${e.message}`);
    continue;
  }
  const title = meta.title != null ? String(meta.title) : "";
  const date = meta.date ? new Date(meta.date).toISOString() : null;
  const tags = Array.isArray(meta.tags) ? meta.tags.map(String) : [];
  const excerpt = meta.summary != null ? String(meta.summary) : (meta.excerpt != null ? String(meta.excerpt) : "");
  const imgs = collectImages(content).map((img) => ({ ...img, ...classifyImage(img.url, f) }));

  for (const img of imgs) {
    if (img.kind === "absolute") imageStats.absolute++;
    else if (img.kind === "public-like") imageStats.publicLike++;
    else if (img.kind === "relative") {
      imageStats.relative++;
      if (!img.exists) imageStats.relativeMissing.push({ slug, url: img.url, abs: img.abs });
    } else imageStats.other.push({ slug, url: img.url });
  }

  records.push({ slug, title, date, tags, excerpt, content, images: imgs, file: rel, bytes: Buffer.byteLength(raw) });
}

const problems = records.filter((r) => !r.title || !r.date);
console.log(`\n扫描完成: 共 ${files.length} 个文件, 可解析 ${records.length} 篇`);
console.log(`图片引用: absolute=${imageStats.absolute} publicLike=${imageStats.publicLike} relative=${imageStats.relative} other=${imageStats.other.length}`);
if (imageStats.relativeMissing.length) {
  console.log(`相对引用缺失目标 ${imageStats.relativeMissing.length} 处:`);
  for (const m of imageStats.relativeMissing) console.log(`  - ${m.slug}: ${m.url} (${m.abs})`);
}
if (imageStats.other.length) {
  console.log(`其他引用 ${imageStats.other.length} 处:`);
  for (const m of imageStats.other) console.log(`  - ${m.slug}: ${m.url}`);
}
if (problems.length) {
  console.log(`⚠️ 缺少 title/date 的文章:`);
  for (const p of problems) console.log(`  - ${p.slug} (title=${JSON.stringify(p.title)} date=${p.date})`);
}

const report = {
  generatedAt: new Date().toISOString(),
  mode: APPLY ? "apply" : "dry-run",
  fileCount: files.length,
  recordCount: records.length,
  slugList: records.map((r) => r.slug),
  imageStats,
  problems: problems.map((p) => ({ slug: p.slug, title: p.title, date: p.date })),
};
const reportPath = path.join(ROOT, "drizzle", APPLY ? "migration-report.json" : "migration-dryrun.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(`报告 -> ${reportPath}`);

if (!APPLY) {
  console.log("\n[dry-run] 未写数据库。确认无误后执行: node scripts/migrate-posts.mjs --apply");
  process.exit(0);
}

// ============ --apply：写入数据库 ============
const { neon } = await import("@neondatabase/serverless");
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("[apply] 缺少 DATABASE_URL 环境变量");
  process.exit(1);
}
const sql = neon(DATABASE_URL);

const applied = [];
const skipped = [];
for (const r of records) {
  try {
    await sql`
      INSERT INTO posts (slug, title, date, tags, excerpt, content_md, status)
      VALUES (${r.slug}, ${r.title}, ${r.date}, ${JSON.stringify(r.tags)}, ${r.excerpt || null}, ${r.content}, 'published')
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        date = EXCLUDED.date,
        tags = EXCLUDED.tags,
        excerpt = EXCLUDED.excerpt,
        content_md = EXCLUDED.content_md,
        status = EXCLUDED.status,
        updated_at = now()
    `;
    applied.push(r.slug);
  } catch (e) {
    skipped.push({ slug: r.slug, error: e.message });
    console.error(`[FAIL] ${r.slug}: ${e.message}`);
  }
}

const count = await sql`SELECT count(*)::int AS n FROM posts`;
console.log(`\n迁移完成: 成功 ${applied.length} 篇, 失败 ${skipped.length} 篇, 表内总数 ${count[0].n}`);

// 校验：DB 记录数 vs 仓库文章数
const expect = records.length;
const actual = count[0].n;
console.log(`校验: 仓库文件 ${expect} 篇 vs DB 记录 ${actual} 条 ${actual === expect ? "✅ 一致" : "⚠️ 不一致"}`);

// 抽样 3 篇对比正文完整
const sampleSlugs = records.slice(0, 3).map((r) => r.slug);
for (const s of sampleSlugs) {
  const row = await sql`SELECT slug, title, length(content_md)::int AS len FROM posts WHERE slug = ${s}`;
  const src = records.find((r) => r.slug === s);
  const ok = row.length === 1 && row[0].len === src.bytes;
  console.log(`抽样 [${s}]: DB title=${row[0]?.title ?? "N/A"} content_len=${row[0]?.len ?? 0} 源字节=${src.bytes} ${ok ? "✅" : "⚠️"}`);
}

report.applied = applied;
report.skipped = skipped;
report.sampleCheck = sampleSlugs;
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(`最终报告 -> ${reportPath}`);

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
import crypto from "node:crypto";
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
// 无法解析来源的裸文件名：只登记，绝不猜测改写
const unresolvedImages = [];

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
    } else {
      imageStats.other.push({ slug, url: img.url });
      unresolvedImages.push({ slug, url: img.url, type: img.type, action: "keep-as-is" });
    }
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
  unresolvedImages,
  unresolvedImageCount: unresolvedImages.length,
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

// ---------- 校验：全量对比 DB 与源文件 ----------
// 口径统一：源侧使用 gray-matter 去除 frontmatter 后的 content；DB 侧使用 content_md。
// 用 md5 全量比对，避免把大段正文拉回内存；抽样再做逐字精确比对。
const md5 = (s) => crypto.createHash("md5").update(s, "utf8").digest("hex");

const dbRows = await sql`SELECT slug, title, tags, excerpt, status, md5(content_md) AS content_hash FROM posts`;
const dbBySlug = new Map(dbRows.map((r) => [r.slug, r]));
const sourceSlugs = new Set(records.map((r) => r.slug));

const missingInDb = records.filter((r) => !dbBySlug.has(r.slug)).map((r) => r.slug);
const extraInDb = dbRows.filter((r) => !sourceSlugs.has(r.slug)).map((r) => r.slug);
const contentDiff = records
  .filter((r) => dbBySlug.has(r.slug) && dbBySlug.get(r.slug).content_hash !== md5(r.content))
  .map((r) => r.slug);

const titleDiff = records
  .filter((r) => dbBySlug.has(r.slug) && dbBySlug.get(r.slug).title !== r.title)
  .map((r) => r.slug);
const tagsDiff = records
  .filter((r) => dbBySlug.has(r.slug) && JSON.stringify(dbBySlug.get(r.slug).tags ?? []) !== JSON.stringify(r.tags ?? []))
  .map((r) => r.slug);
const excerptDiff = records
  .filter((r) => dbBySlug.has(r.slug) && (dbBySlug.get(r.slug).excerpt ?? "") !== (r.excerpt ?? ""))
  .map((r) => r.slug);
const statusDiff = dbRows.filter((r) => r.status !== "published").map((r) => r.slug);

console.log(
  `校验: 源文件 ${records.length} 篇 vs DB ${dbRows.length} 条 ${records.length === dbRows.length ? "一致" : "不一致"}`
);
console.log(`缺失 ${missingInDb.length} 篇 / 多余 ${extraInDb.length} 条 / 正文差异 ${contentDiff.length} 篇`);
console.log(
  `字段差异: title ${titleDiff.length} / tags ${tagsDiff.length} / excerpt ${excerptDiff.length} / 非 published ${statusDiff.length}`
);
console.log(`无法解析来源的图片裸路径 ${unresolvedImages.length} 条（保持原样，未改写）`);

// 抽样 3 篇逐字精确对比正文
const sampleSlugs = records.slice(0, 3).map((r) => r.slug);
const sampleChecks = [];
for (const s of sampleSlugs) {
  const src = records.find((r) => r.slug === s);
  const row = await sql`SELECT title, content_md FROM posts WHERE slug = ${s}`;
  const dbContent = row[0]?.content_md ?? null;
  const exactMatch = dbContent === src.content;
  const dbChars = dbContent == null ? 0 : [...dbContent].length;
  const sourceChars = [...src.content].length;
  sampleChecks.push({ slug: s, title: row[0]?.title ?? null, dbChars, sourceChars, exactMatch });
  console.log(
    `抽样 [${s}]: DB title=${row[0]?.title ?? "N/A"} 字符=${dbChars} 源字符=${sourceChars} ${exactMatch ? "精确一致" : "不一致"}`
  );
}

const allPassed =
  records.length === dbRows.length &&
  missingInDb.length === 0 &&
  extraInDb.length === 0 &&
  contentDiff.length === 0 &&
  titleDiff.length === 0 &&
  tagsDiff.length === 0 &&
  excerptDiff.length === 0 &&
  statusDiff.length === 0 &&
  sampleChecks.every((c) => c.exactMatch);

report.applied = applied;
report.skipped = skipped;
report.sampleCheck = sampleChecks;
report.verification = {
  sourceFileCount: files.length,
  sourceRecordCount: records.length,
  dbRowCount: dbRows.length,
  countMatch: records.length === dbRows.length,
  missingInDb,
  extraInDb,
  contentDiff,
  titleDiff,
  tagsDiff,
  excerptDiff,
  statusDiff,
  unresolvedImageCount: unresolvedImages.length,
  sampleChecks,
  allPassed,
};
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(`最终校验 ${allPassed ? "全部通过" : "未通过"}`);
console.log(`最终报告 -> ${reportPath}`);

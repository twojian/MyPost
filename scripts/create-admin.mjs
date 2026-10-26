/**
 * 生成初始管理员密码的 bcrypt 哈希，用于填入 .env.local 的 ADMIN_PASSWORD_HASH。
 * 用法：node scripts/create-admin.mjs <明文密码>
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("用法: node scripts/create-admin.mjs <明文密码>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("ADMIN_PASSWORD_HASH=" + hash);

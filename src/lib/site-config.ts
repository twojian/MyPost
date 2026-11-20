/**
 * 站点级配置单一来源。
 *
 * 站名、作者、联系方式等跨页面重复出现的取值集中在此定义，
 * 组件一律从这里引用，禁止在 JSX 里散落字面量邮箱 / URL。
 */

export const siteConfig = {
  /** 站点短名（Logo、页脚版权、侧边栏署名共用） */
  name: "Twojian",
  /** 站点全名（metadata title 模板） */
  title: "Twojian Blog",
  /** 站点描述（metadata description、SEO） */
  description: "记录个人计算机考研笔记、数学基础与技术思考",
  /** 作者署名 */
  author: "Twojian",
  /** 首页一句话简介 */
  tagline: "less is more",
  /** 站点正式域名（用于判定正文里"同域绝对地址"属于站内链接） */
  url: "https://twojian.cloud",
  /** GitHub 主页 */
  github: "https://github.com/twojian",
  /**
   * 联系邮箱（全站唯一来源）。
   *
   * 首页 Bento 社交卡、侧边栏底部名片、博客圈页脚等处的邮箱与 `mailto:` 链接
   * 一律由此取值派生，页面里不得再写字面量。更换邮箱只改这一行。
   */
  email: "twojian6@gmail.com",
  /** 无障碍标签 */
  githubLabel: "GitHub",
  emailLabel: "Email",
} as const;

/** `mailto:` 链接（邮箱值只在上面的 siteConfig 维护） */
export const mailtoHref = `mailto:${siteConfig.email}`;

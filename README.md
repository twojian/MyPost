# Twojian Blog

一个基于 Next.js 16 + MDX 的现代化博客系统，带有可自定义的 Bento 网格布局和完整的后台管理功能。

## 功能特性

### 🏠 首页
- 响应式 Bento 网格布局（支持自定义布局）
- 时钟、日历、音乐播放器小组件
- 最新文章、随机文章展示
- 移动端适配

### 📝 文章系统
- MDX 格式文章支持（代码高亮、数学公式、自定义组件）
- 文章分类、标签、归档
- 全文模糊搜索
- 阅读时间统计
- 目录导航

### 🎨 后台管理
- 文章编辑（MDX 编辑器 + 实时预览）
- 首页布局拖拽编辑
- 文章分组管理
- 权限认证

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容**: MDX + next-mdx-remote
- **UI 库**: Lucide React
- **拖拽**: @dnd-kit
- **编辑器**: @uiw/react-md-editor
- **验证**: Zod
- **认证**: jose + bcryptjs

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
# 管理员认证
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD_HASH=bcrypt-hashed-password
AUTH_SECRET=your-secret-key-at-least-32-characters
```

生成密码哈希：
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

### 3. 开发模式运行

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站，访问 [http://localhost:3000/admin](http://localhost:3000/admin) 进入后台。

## 项目结构

```
.
├── config/              # 配置文件
│   ├── layout.json      # 首页布局配置
│   ├── groups.json      # 文章分组配置
│   └── site.json        # 站点配置（可选）
├── content/
│   └── posts/           # MDX 文章文件
├── public/              # 静态资源
├── src/
│   ├── app/
│   │   ├── admin/       # 后台管理页面
│   │   ├── api/         # API 路由
│   │   └── ...          # 前台页面
│   ├── components/      # React 组件
│   └── lib/             # 工具函数
└── ...
```

## 部署指南

### Vercel 部署（推荐）

1. Fork 或克隆此仓库
2. 在 Vercel 中导入项目
3. 配置环境变量（同 `.env.local`）
4. 点击部署

### 其他平台

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

## 后台功能

### 文章管理
- 新建/编辑/删除文章
- Frontmatter 配置（标题、日期、分类、标签、摘要）
- MDX 实时预览

### 布局编辑
- 拖拽调整卡片位置
- 调整卡片大小
- 显示/隐藏卡片
- 数值精确编辑

### 分组管理
- 新建/编辑/删除分组
- 拖拽排序
- 图标和描述配置

## 许可证

MIT

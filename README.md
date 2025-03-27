# 知识库网站

一个基于Next.js、MongoDB和Vercel构建的知识库网站，支持分类、系列和章节的组织结构，以及富文本编辑和视频嵌入功能。

## 功能特点

- 响应式设计，适配PC和移动设备
- 分类、系列、章节三级内容组织结构
- 富文本编辑器，支持表格、加粗、居中等格式化功能
- 视频嵌入功能
- 管理员后台，支持内容的创建、编辑和删除
- 基于NextAuth.js的认证系统

## 技术栈

- **前端框架**: Next.js (React框架)
- **数据库**: MongoDB
- **认证**: NextAuth.js
- **富文本编辑器**: CKEditor 5
- **样式**: Tailwind CSS
- **部署**: Vercel

## 环境变量

项目需要以下环境变量:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/knowledge-base
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password
```

## 本地开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

## 部署

项目可以直接部署到Vercel，只需连接GitHub仓库并设置环境变量即可。

## 许可证

MIT

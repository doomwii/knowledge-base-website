# 知识库网站部署指南

本指南将帮助您将知识库网站部署到Vercel并连接MongoDB数据库。

## 准备工作

确保您已经拥有以下账户：
- GitHub账户
- Vercel账户（可以使用GitHub账户登录）
- MongoDB Atlas账户

## 部署步骤

### 1. 推送代码到GitHub

1. 克隆您在GitHub上创建的仓库：
```bash
git clone https://github.com/doomwii/knowledge-base-website.git
cd knowledge-base-website
```

2. 复制项目文件到仓库目录：
```bash
# 将deployment-guide目录中的所有文件复制到仓库目录
cp -r /path/to/deployment-guide/* .
```

3. 添加、提交并推送代码：
```bash
git add .
git commit -m "初始提交：知识库网站完整代码"
git push -u origin main
```

### 2. 在MongoDB Atlas创建数据库

1. 登录MongoDB Atlas账户：https://cloud.mongodb.com/
2. 创建一个新的项目（如果需要）
3. 创建一个新的集群（可以使用免费的共享集群）
4. 在"Database Access"中创建一个新的数据库用户，记下用户名和密码
5. 在"Network Access"中添加IP地址0.0.0.0/0（允许从任何地方访问）
6. 在集群页面点击"Connect"，然后选择"Connect your application"
7. 复制连接字符串，它看起来像这样：`mongodb+srv://<username>:<password>@cluster.mongodb.net/knowledge-base`
8. 将`<username>`和`<password>`替换为您创建的数据库用户的凭据

### 3. 在Vercel部署项目

1. 登录Vercel账户：https://vercel.com/login（使用GitHub账户登录）
2. 点击"New Project"
3. 从GitHub导入您的仓库"knowledge-base-website"
4. 在配置页面，添加以下环境变量：
   - `MONGODB_URI`：您的MongoDB连接字符串
   - `NEXTAUTH_URL`：部署后的网站URL（可以先使用Vercel提供的默认域名，如`https://knowledge-base-website.vercel.app`）
   - `NEXTAUTH_SECRET`：一个随机字符串，用于加密会话（可以使用`openssl rand -base64 32`生成）
   - `ADMIN_USERNAME`：管理员用户名
   - `ADMIN_PASSWORD`：管理员密码
5. 点击"Deploy"开始部署

### 4. 验证部署

1. 部署完成后，Vercel会提供一个URL，点击访问您的知识库网站
2. 访问`/admin/login`路径登录管理后台
3. 使用您设置的管理员用户名和密码登录
4. 开始创建分类、系列和章节内容

## 本地开发

如果您想在本地开发和测试项目：

1. 克隆仓库到本地：
```bash
git clone https://github.com/doomwii/knowledge-base-website.git
cd knowledge-base-website
```

2. 安装依赖：
```bash
npm install
```

3. 创建`.env.local`文件，添加必要的环境变量：
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/knowledge-base
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 在浏览器中访问`http://localhost:3000`

## 项目结构

- `src/app`：Next.js应用路由
- `src/components`：React组件
- `src/lib`：工具函数和数据库连接
- `src/models`：MongoDB数据模型
- `public`：静态资源

## 常见问题

### MongoDB连接问题

如果遇到MongoDB连接问题，请检查：
- 连接字符串是否正确
- 数据库用户名和密码是否正确
- IP访问限制是否已配置

### Vercel部署问题

如果遇到Vercel部署问题，请检查：
- 环境变量是否正确设置
- 构建日志中是否有错误信息

### 管理员登录问题

如果无法登录管理后台，请检查：
- `ADMIN_USERNAME`和`ADMIN_PASSWORD`环境变量是否正确设置
- `NEXTAUTH_URL`和`NEXTAUTH_SECRET`环境变量是否正确设置

## 联系支持

如果您在部署过程中遇到任何问题，请联系我们的支持团队获取帮助。

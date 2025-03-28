/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // 启用静态导出
  images: {
    unoptimized: true, // 静态导出需要禁用图片优化
  },
  // 禁用压缩，避免某些渲染问题
  compress: false,
  // 添加环境变量配置
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_URL: 'https://knowledge-base-website-theta.vercel.app',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'doomwang91',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'mina1995',
  },
  // 静态导出模式不支持自定义headers，已移除
};

module.exports = nextConfig;

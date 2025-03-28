/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 启用静态导出
  output: 'export',
  // 禁用图像优化，这在静态导出中不支持
  images: {
    unoptimized: true,
  },
  // 添加环境变量配置
  env: {
    MONGODB_URI: "mongodb+srv://doomwang:wang@cluster0.6doay8h.mongodb.net/IPkonwledge?retryWrites=true&w=majority&appName=Cluster0",
    NEXTAUTH_URL: "https://knowledge-base-website-theta.vercel.app",
    NEXTAUTH_SECRET: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    ADMIN_USERNAME: "doomwang91",
    ADMIN_PASSWORD: "mina1995"
  },
};

module.exports = nextConfig;

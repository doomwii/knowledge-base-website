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
    NEXTAUTH_SECRET: "a1b2c3d4e5f6g7h819j0k1l2m3n4o5p6",
    ADMIN_USERNAME: "doomwang91",
    ADMIN_PASSWORD: "mina1995"
  },
  // 禁用严格模式以避免潜在的渲染问题
  reactStrictMode: false,
  // 配置跨域
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  // 禁用webpack5的一些功能以提高兼容性
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;

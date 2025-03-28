/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 添加输出配置，确保正确渲染
  output: 'standalone',
  // 添加跨域配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  // 禁用压缩，避免某些渲染问题
  compress: false,
  // 添加环境变量配置
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_URL: 'https://knowledge-base-website-theta.vercel.app',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your_nextauth_secret_key_here',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'doomwang91',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'mina1995',
  },
  // 添加webpack配置，解决某些兼容性问题
  webpack: (config, { isServer }) => {
    // 修复某些库的兼容性问题
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

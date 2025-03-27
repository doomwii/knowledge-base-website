/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 允许在图片src中使用外部域名（用于视频嵌入等功能）
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
  // 添加缓存清除配置
  experimental: {
    // 禁用构建缓存
    disableOptimizedLoading: true,
    // 强制完全重新构建
    forceSwcTransforms: true
  }
};

module.exports = nextConfig;

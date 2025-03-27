/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ckeditor/ckeditor5-react',
    '@ckeditor/ckeditor5-build-classic',
    '@ckeditor/ckeditor5-watchdog'
  ],
  // 允许在图片src中使用外部域名（用于视频嵌入等功能）
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  }
};

module.exports = nextConfig;

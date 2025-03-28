// 修复持续存在的渲染问题
require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('开始修复持续存在的渲染问题...');

// 1. 修复next.config.js，添加更多配置以解决渲染问题
const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
let nextConfigContent = '';

try {
  nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
} catch (error) {
  // 如果文件不存在，创建一个新的配置文件
  nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
`;
}

// 更新next.config.js配置
const updatedNextConfig = `/** @type {import('next').NextConfig} */
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
`;

fs.writeFileSync(nextConfigPath, updatedNextConfig);
console.log('已更新next.config.js配置');

// 2. 创建一个简单的自定义文档组件，确保正确加载CSS和脚本
const documentPath = path.join(__dirname, '..', 'src', 'pages', '_document.tsx');
const documentDir = path.dirname(documentPath);

// 确保目录存在
if (!fs.existsSync(documentDir)) {
  fs.mkdirSync(documentDir, { recursive: true });
}

const documentContent = `import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh">
      <Head>
        {/* 添加关键的meta标签 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 添加预加载字体和样式 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`;

fs.writeFileSync(documentPath, documentContent);
console.log('已创建自定义_document.tsx组件');

// 3. 创建一个简单的自定义应用组件，确保正确初始化
const appPath = path.join(__dirname, '..', 'src', 'pages', '_app.tsx');

const appContent = `import '@/app/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
`;

fs.writeFileSync(appPath, appContent);
console.log('已创建自定义_app.tsx组件');

// 4. 修复middleware.ts文件，确保正确处理请求
const middlewarePath = path.join(__dirname, '..', 'src', 'middleware.ts');
const middlewareContent = `
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 这个中间件确保NextAuth在生产环境中正常工作
export function middleware(request: NextRequest) {
  // 允许跨域请求
  const response = NextResponse.next();
  
  // 添加CORS头
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/api/:path*'],
};
`;

fs.writeFileSync(middlewarePath, middlewareContent);
console.log('已更新middleware.ts文件');

// 5. 创建一个.babelrc文件，确保正确转译
const babelrcPath = path.join(__dirname, '..', '.babelrc');
const babelrcContent = `{
  "presets": ["next/babel"],
  "plugins": []
}
`;

fs.writeFileSync(babelrcPath, babelrcContent);
console.log('已创建.babelrc文件');

// 6. 更新package.json，添加必要的脚本和依赖
const packageJsonPath = path.join(__dirname, '..', 'package.json');
let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 添加必要的脚本
packageJson.scripts = {
  ...packageJson.scripts,
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
};

// 确保有必要的依赖
if (!packageJson.dependencies) {
  packageJson.dependencies = {};
}

// 保存更新后的package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('已更新package.json文件');

// 7. 创建一个vercel.json文件，添加特定的Vercel配置
const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
const vercelJsonContent = `{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1",
      "headers": {
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "x-xss-protection": "1; mode=block"
      }
    }
  ],
  "env": {
    "MONGODB_URI": "${process.env.MONGODB_URI}",
    "NEXTAUTH_URL": "https://knowledge-base-website-theta.vercel.app",
    "NEXTAUTH_SECRET": "${process.env.NEXTAUTH_SECRET || 'your_nextauth_secret_key_here'}",
    "ADMIN_USERNAME": "${process.env.ADMIN_USERNAME || 'doomwang91'}",
    "ADMIN_PASSWORD": "${process.env.ADMIN_PASSWORD || 'mina1995'}"
  }
}
`;

fs.writeFileSync(vercelJsonPath, vercelJsonContent);
console.log('已创建vercel.json文件');

console.log('渲染问题修复完成！请提交并推送更改，然后等待Vercel重新部署。');

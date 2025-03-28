// 修复NextAuth配置问题的脚本
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// 连接MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

console.log('开始修复NextAuth配置问题...');

// 修复.env文件中的NEXTAUTH_URL
const envFilePath = path.join(__dirname, '..', '.env');
let envContent = fs.readFileSync(envFilePath, 'utf8');

// 替换NEXTAUTH_URL为正确的生产环境URL
envContent = envContent.replace(
  /NEXTAUTH_URL=http:\/\/localhost:3000/,
  'NEXTAUTH_URL=https://knowledge-base-website-theta.vercel.app'
);

// 写回.env文件
fs.writeFileSync(envFilePath, envContent);
console.log('已更新.env文件中的NEXTAUTH_URL为生产环境URL');

// 创建一个middleware.ts文件来处理NextAuth的跨域问题
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
console.log('已创建middleware.ts文件处理NextAuth的跨域问题');

// 修复NextAuth配置文件，添加更多错误处理和调试信息
const nextAuthPath = path.join(__dirname, '..', 'src', 'app', 'api', 'auth', '[...nextauth]', 'route.ts');
let nextAuthContent = fs.readFileSync(nextAuthPath, 'utf8');

// 添加更多错误处理和调试信息
const updatedNextAuthContent = nextAuthContent.replace(
  'export const authOptions: NextAuthOptions = {',
  `export const authOptions: NextAuthOptions = {
  // 添加调试模式，帮助排查问题
  debug: true,`
);

fs.writeFileSync(nextAuthPath, updatedNextAuthContent);
console.log('已更新NextAuth配置，添加调试模式');

// 创建一个简单的修复页面渲染问题的组件
const errorBoundaryPath = path.join(__dirname, '..', 'src', 'components', 'ErrorBoundary.tsx');
const errorBoundaryDir = path.dirname(errorBoundaryPath);

// 确保目录存在
if (!fs.existsSync(errorBoundaryDir)) {
  fs.mkdirSync(errorBoundaryDir, { recursive: true });
}

const errorBoundaryContent = `
'use client';

import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">页面加载出错</h2>
          <p className="text-red-600 mb-4">
            抱歉，页面加载过程中出现了问题。请尝试刷新页面或联系管理员。
          </p>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => this.setState({ hasError: false })}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
`;

fs.writeFileSync(errorBoundaryPath, errorBoundaryContent);
console.log('已创建ErrorBoundary组件处理页面渲染错误');

// 修改根布局文件，添加错误边界
const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

// 检查是否已经导入了ErrorBoundary
if (!layoutContent.includes('ErrorBoundary')) {
  // 添加导入语句
  layoutContent = layoutContent.replace(
    "import './globals.css'",
    "import './globals.css'\nimport ErrorBoundary from '../components/ErrorBoundary'"
  );
  
  // 在body标签内添加ErrorBoundary
  layoutContent = layoutContent.replace(
    /<body[^>]*>([\s\S]*?)<\/body>/,
    '<body className={inter.className}><ErrorBoundary>$1</ErrorBoundary></body>'
  );
  
  fs.writeFileSync(layoutPath, layoutContent);
  console.log('已更新根布局文件，添加错误边界');
}

console.log('NextAuth配置问题修复完成！');

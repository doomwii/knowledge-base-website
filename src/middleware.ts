
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

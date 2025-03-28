import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 简化的中间件，只处理基本的跨域问题
export function middleware(request: NextRequest) {
  // 创建响应对象
  const response = NextResponse.next();
  
  // 添加基本的CORS头
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// 只应用于API路由
export const config = {
  matcher: ['/api/:path*'],
};

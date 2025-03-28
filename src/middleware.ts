import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // 设置CORS头
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 检查是否是管理员路由
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && 
                       !request.nextUrl.pathname.startsWith('/admin/login');
  
  if (isAdminRoute) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" 
    });
    
    // 如果没有令牌或令牌无效，重定向到登录页面
    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return response;
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};

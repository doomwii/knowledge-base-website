'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? 'bg-blue-700' : '';
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">知识库管理</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className={`block p-2 rounded hover:bg-blue-700 ${isActive('/admin') && pathname === '/admin' ? 'bg-blue-700' : ''}`}>
                控制面板
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className={`block p-2 rounded hover:bg-blue-700 ${isActive('/admin/categories')}`}>
                分类管理
              </Link>
            </li>
            <li>
              <Link href="/admin/series" className={`block p-2 rounded hover:bg-blue-700 ${isActive('/admin/series')}`}>
                系列管理
              </Link>
            </li>
            <li>
              <Link href="/admin/chapters" className={`block p-2 rounded hover:bg-blue-700 ${isActive('/admin/chapters')}`}>
                章节管理
              </Link>
            </li>
            <li className="mt-8">
              <button 
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="block w-full text-left p-2 rounded hover:bg-red-600 bg-red-700"
              >
                退出登录
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}

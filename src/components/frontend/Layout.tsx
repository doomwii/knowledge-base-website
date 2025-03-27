'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            知识库
          </Link>
          
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className={`hover:underline ${pathname === '/' ? 'font-bold' : ''}`}>
                  首页
                </Link>
              </li>
              {/* 分类导航将在页面加载时动态添加 */}
            </ul>
          </nav>
        </div>
        
        {mobileMenuOpen && (
          <nav className="md:hidden bg-blue-800 p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`block py-1 ${pathname === '/' ? 'font-bold' : ''}`}>
                  首页
                </Link>
              </li>
              {/* 分类导航将在页面加载时动态添加 */}
            </ul>
          </nav>
        )}
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} 知识库网站</p>
          <p className="mt-2 text-sm text-gray-400">基于Next.js、MongoDB和Vercel构建</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface FrontendLayoutProps {
  children: ReactNode;
}

const FrontendLayout = ({ children }: FrontendLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              知识库
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                首页
              </Link>
              <Link href="/admin/login" className="text-gray-700 hover:text-blue-600">
                管理入口
              </Link>
            </nav>
            <div className="md:hidden">
              <button className="text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} 知识库网站 | 版权所有
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FrontendLayout;

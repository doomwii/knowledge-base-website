import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '知识库网站',
  description: '专业知识产权知识库',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-xl font-bold text-blue-600">
                知识库
              </a>
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-700 hover:text-blue-600">
                  首页
                </a>
                <a href="/admin/login" className="text-gray-700 hover:text-blue-600">
                  管理入口
                </a>
              </nav>
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
      </body>
    </html>
  );
}

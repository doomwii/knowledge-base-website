'use client';

import { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 使用客户端渲染来避免服务端渲染问题
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="zh">
      <body className={inter.className}>
        <ErrorBoundary>
          {isClient ? children : <div>页面加载中...</div>}
        </ErrorBoundary>
      </body>
    </html>
  );
}

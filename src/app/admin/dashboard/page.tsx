'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [stats, setStats] = useState({
    categories: 0,
    series: 0,
    chapters: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查用户是否已登录
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      // 加载统计数据
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // 获取分类数量
      const categoriesResponse = await fetch('/api/categories');
      const seriesResponse = await fetch('/api/series');
      const chaptersResponse = await fetch('/api/chapters');
      
      if (categoriesResponse.ok && seriesResponse.ok && chaptersResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        const seriesData = await seriesResponse.json();
        const chaptersData = await chaptersResponse.json();
        
        setStats({
          categories: categoriesData.length,
          series: seriesData.length,
          chapters: chaptersData.length
        });
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">管理仪表盘</h1>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              查看网站
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">欢迎回来，{session?.user?.name || '管理员'}</h2>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">账号信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">用户名:</span> {session?.user?.name || '-'}
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">邮箱:</span> {session?.user?.email || '-'}
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">角色:</span> {session?.user?.role || '管理员'}
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">状态:</span> 已登录
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">内容统计</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">分类</h3>
                  <p className="text-3xl font-bold">{stats.categories}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/categories" className="text-blue-600 hover:text-blue-800">
                  管理分类 →
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">系列</h3>
                  <p className="text-3xl font-bold">{stats.series}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/series" className="text-purple-600 hover:text-purple-800">
                  管理系列 →
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">章节</h3>
                  <p className="text-3xl font-bold">{stats.chapters}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/admin/chapters" className="text-green-600 hover:text-green-800">
                  管理章节 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">快速操作</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/categories" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">管理分类</h3>
              <p className="text-gray-600">创建、编辑和删除内容分类</p>
            </Link>
            
            <Link href="/admin/series" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">管理系列</h3>
              <p className="text-gray-600">创建、编辑和删除内容系列</p>
            </Link>
            
            <Link href="/admin/chapters" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">管理章节</h3>
              <p className="text-gray-600">创建、编辑和删除内容章节</p>
            </Link>
            
            <Link href="/admin/chapters/new" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">创建新章节</h3>
              <p className="text-gray-600">使用富文本编辑器创建新内容</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

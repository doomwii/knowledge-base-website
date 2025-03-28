'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChaptersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [chapters, setChapters] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');

  useEffect(() => {
    // 检查用户是否已登录
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      // 加载系列和章节数据
      fetchSeries();
      fetchChapters();
    }
  }, [status, router]);

  const fetchSeries = async () => {
    try {
      const response = await fetch('/api/series');
      if (response.ok) {
        const data = await response.json();
        setSeries(data);
      } else {
        console.error('获取系列失败');
      }
    } catch (error) {
      console.error('获取系列出错:', error);
    }
  };

  const fetchChapters = async (seriesId = null) => {
    try {
      setLoading(true);
      const url = seriesId ? `/api/chapters?seriesId=${seriesId}` : '/api/chapters';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      } else {
        setError('获取章节失败');
      }
    } catch (error) {
      setError('获取章节出错');
    } finally {
      setLoading(false);
    }
  };

  const handleSeriesChange = (e) => {
    const value = e.target.value;
    setSelectedSeries(value);
    if (value === 'all') {
      fetchChapters();
    } else {
      fetchChapters(value);
    }
  };

  const handleDeleteChapter = async (slug) => {
    if (!confirm('确定要删除这个章节吗？此操作不可恢复！')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/chapters/${slug}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // 刷新章节列表
        if (selectedSeries === 'all') {
          fetchChapters();
        } else {
          fetchChapters(selectedSeries);
        }
      } else {
        const data = await response.json();
        alert(data.error || '删除章节失败');
      }
    } catch (error) {
      alert('删除章节过程中发生错误');
    }
  };

  // 获取系列名称
  const getSeriesName = (seriesId) => {
    const seriesItem = series.find(s => s._id === seriesId);
    return seriesItem ? seriesItem.name : '-';
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
          <h1 className="text-2xl font-bold text-gray-900">章节管理</h1>
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
              返回仪表盘
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">所有章节</h2>
          <Link
            href="/admin/chapters/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            创建新章节
          </Link>
        </div>

        <div className="mb-6">
          <label htmlFor="seriesFilter" className="block text-sm font-medium text-gray-700 mb-1">
            按系列筛选
          </label>
          <select
            id="seriesFilter"
            value={selectedSeries}
            onChange={handleSeriesChange}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">所有系列</option>
            {series.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {chapters.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">暂无章节，请创建新章节</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    所属系列
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    别名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排序
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chapters.map((chapter) => (
                  <tr key={chapter._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{chapter.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getSeriesName(chapter.seriesId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{chapter.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{chapter.order || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        chapter.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {chapter.isPublished ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/chapters/edit/${chapter.slug}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        编辑
                      </Link>
                      <Link href={`/chapter/${chapter.slug}`} target="_blank" className="text-green-600 hover:text-green-900 mr-4">
                        查看
                      </Link>
                      <button
                        onClick={() => handleDeleteChapter(chapter.slug)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

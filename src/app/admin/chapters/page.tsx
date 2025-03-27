'use client';

import { useState, useEffect } from 'react';
import AuthCheck from '@/components/AuthCheck';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface Chapter {
  _id: string;
  title: string;
  slug: string;
  series: string;
  seriesName?: string;
  order: number;
  published: boolean;
  createdAt: string;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/chapters');
        if (!response.ok) {
          throw new Error('获取章节列表失败');
        }
        const data = await response.json();
        setChapters(data);
      } catch (err) {
        setError('获取章节列表时出错');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个章节吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/chapters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除章节失败');
      }

      setChapters(chapters.filter(chapter => chapter._id !== id));
    } catch (err) {
      setError('删除章节时出错');
      console.error(err);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/chapters/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ published: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('更新发布状态失败');
      }

      setChapters(chapters.map(chapter => 
        chapter._id === id 
          ? { ...chapter, published: !currentStatus } 
          : chapter
      ));
    } catch (err) {
      setError('更新发布状态时出错');
      console.error(err);
    }
  };

  return (
    <AuthCheck>
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">章节管理</h1>
            <Link href="/admin/chapters/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              添加章节
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : chapters.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              暂无章节数据。请点击"添加章节"按钮创建新章节。
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属系列</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chapters.map((chapter) => (
                    <tr key={chapter._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{chapter.title}</div>
                        <div className="text-sm text-gray-500">{chapter.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {chapter.seriesName || '未知系列'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {chapter.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          chapter.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {chapter.published ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/chapters/${chapter._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                          编辑
                        </Link>
                        <button
                          onClick={() => togglePublish(chapter._id, chapter.published)}
                          className={`mr-3 ${
                            chapter.published 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {chapter.published ? '取消发布' : '发布'}
                        </button>
                        <button
                          onClick={() => handleDelete(chapter._id)}
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
        </div>
      </AdminLayout>
    </AuthCheck>
  );
}

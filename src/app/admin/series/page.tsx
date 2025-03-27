'use client';

import { useState, useEffect } from 'react';
import AuthCheck from '@/components/AuthCheck';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface Series {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categoryName?: string;
  order: number;
  createdAt: string;
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/series');
        if (!response.ok) {
          throw new Error('获取系列列表失败');
        }
        const data = await response.json();
        setSeries(data);
      } catch (err) {
        setError('获取系列列表时出错');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个系列吗？这将同时删除所有关联的章节！')) {
      return;
    }

    try {
      const response = await fetch(`/api/series/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除系列失败');
      }

      setSeries(series.filter(item => item._id !== id));
    } catch (err) {
      setError('删除系列时出错');
      console.error(err);
    }
  };

  return (
    <AuthCheck>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">系列管理</h1>
            <Link href="/admin/series/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              添加系列
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
          ) : series.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              暂无系列数据。请点击"添加系列"按钮创建新系列。
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {series.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.categoryName || '未知分类'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/series/${item._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
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

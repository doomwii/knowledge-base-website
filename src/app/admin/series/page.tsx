'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SeriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 新系列表单状态
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [order, setOrder] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    // 检查用户是否已登录
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      // 加载分类和系列数据
      fetchCategories();
      fetchSeries();
    }
  }, [status, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0]._id);
        }
      } else {
        console.error('获取分类失败');
      }
    } catch (error) {
      console.error('获取分类出错:', error);
    }
  };

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/series');
      if (response.ok) {
        const data = await response.json();
        setSeries(data);
      } else {
        setError('获取系列失败');
      }
    } catch (error) {
      setError('获取系列出错');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSeries = async (e) => {
    e.preventDefault();
    
    if (!name || !slug || !categoryId) {
      setFormError('名称、别名和分类为必填项');
      return;
    }
    
    try {
      setFormLoading(true);
      setFormError('');
      
      const seriesData = {
        name,
        slug,
        description,
        categoryId,
        order: Number(order)
      };
      
      const response = await fetch('/api/series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seriesData),
      });
      
      if (response.ok) {
        setFormSuccess('系列创建成功');
        // 重置表单
        setName('');
        setSlug('');
        setDescription('');
        setOrder(0);
        // 刷新系列列表
        fetchSeries();
        // 隐藏表单
        setTimeout(() => {
          setShowForm(false);
          setFormSuccess('');
        }, 2000);
      } else {
        const data = await response.json();
        setFormError(data.error || '创建系列失败');
      }
    } catch (error) {
      setFormError('创建系列过程中发生错误');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSeries = async (id) => {
    if (!confirm('确定要删除这个系列吗？这将同时删除该系列下的所有章节！')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/series/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // 刷新系列列表
        fetchSeries();
      } else {
        const data = await response.json();
        alert(data.error || '删除系列失败');
      }
    } catch (error) {
      alert('删除系列过程中发生错误');
    }
  };

  // 根据名称自动生成别名
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };

  // 获取分类名称
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : '-';
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
          <h1 className="text-2xl font-bold text-gray-900">系列管理</h1>
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
              返回仪表盘
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">所有系列</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showForm ? '取消' : '创建新系列'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-4">创建新系列</h3>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
                {formError}
              </div>
            )}
            
            {formSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-500 rounded-md">
                {formSuccess}
              </div>
            )}
            
            <form onSubmit={handleCreateSeries} className="space-y-4">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  所属分类 *
                </label>
                <select
                  id="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">选择分类</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  名称 *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="系列名称"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  别名 *
                </label>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="系列别名（URL友好）"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="系列描述"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                  排序
                </label>
                <input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="排序（数字越小越靠前）"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    formLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {formLoading ? '保存中...' : '保存系列'}
                </button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {series.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">暂无系列，请创建新系列</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    所属分类
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    别名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    描述
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排序
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {series.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getCategoryName(item.categoryId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{item.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.order || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/series/${item._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDeleteSeries(item._id)}
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

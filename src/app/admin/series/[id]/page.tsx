'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthCheck from '@/components/AuthCheck';
import AdminLayout from '@/components/AdminLayout';

interface SeriesFormProps {
  params: {
    id: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

interface SeriesData {
  name: string;
  slug: string;
  description: string;
  category: string;
  order: number;
}

export default function SeriesForm({ params }: SeriesFormProps) {
  const router = useRouter();
  const { id } = params;
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState<SeriesData>({
    name: '',
    slug: '',
    description: '',
    category: '',
    order: 0
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 获取所有分类
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('获取分类数据失败');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError('获取分类数据时出错');
        console.error(err);
      }
    };

    fetchCategories();

    // 如果是编辑模式，获取系列数据
    if (!isNew) {
      const fetchSeries = async () => {
        try {
          const response = await fetch(`/api/series/${id}`);
          if (!response.ok) {
            throw new Error('获取系列数据失败');
          }
          const data = await response.json();
          setFormData(data);
        } catch (err) {
          setError('获取系列数据时出错');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchSeries();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isNew ? '/api/series' : `/api/series/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('保存系列失败');
      }

      router.push('/admin/series');
      router.refresh();
    } catch (err) {
      setError('保存系列时出错');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthCheck>
      <AdminLayout>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isNew ? '添加系列' : '编辑系列'}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  系列名称
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => !formData.slug && generateSlug()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL标识符)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
                  >
                    生成
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  所属分类
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">选择分类</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                  排序
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          )}
        </div>
      </AdminLayout>
    </AuthCheck>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import AuthCheck from '@/components/AuthCheck';
import AdminLayout from '@/components/AdminLayout';

// CKEditor相关代码已移除，使用普通文本区域代替

interface ChapterFormProps {
  params: {
    id: string;
  };
}

interface Series {
  _id: string;
  name: string;
}

interface ChapterData {
  title: string;
  slug: string;
  content: string;
  series: string;
  videoUrl?: string;
  order: number;
  published: boolean;
}

export default function ChapterForm({ params }: ChapterFormProps) {
  const router = useRouter();
  const { id } = params;
  const isNewChapter = id === 'new';
  
  const [formData, setFormData] = useState<ChapterData>({
    title: '',
    slug: '',
    content: '',
    series: '',
    videoUrl: '',
    order: 0,
    published: false
  });
  
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 移除CKEditor相关状态
  // const [editorLoaded, setEditorLoaded] = useState(false);
  
  useEffect(() => {
    // 获取系列列表
    fetch('/api/series')
      .then(res => res.json())
      .then(data => {
        setSeriesList(data);
      });
    
    // 如果不是新章节，获取章节数据
    if (!isNewChapter) {
      fetch(`/api/chapters/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('章节不存在');
          return res.json();
        })
        .then(data => {
          setFormData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          notFound();
        });
    } else {
      setLoading(false);
    }
    
    // 移除CKEditor加载代码
    // setEditorLoaded(true);
  }, [id, isNewChapter]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const generateSlug = () => {
    const slug = formData.title
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
    
    try {
      const url = isNewChapter ? '/api/chapters' : `/api/chapters/${id}`;
      const method = isNewChapter ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('保存失败');
      
      router.push('/admin/chapters');
    } catch (error) {
      console.error(error);
      setSaving(false);
      alert('保存失败，请重试');
    }
  };
  
  return (
    <AuthCheck>
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">
            {isNewChapter ? '创建新章节' : '编辑章节'}
          </h1>
          
          {loading ? (
            <div>加载中...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
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
                <label htmlFor="series" className="block text-sm font-medium text-gray-700 mb-1">
                  所属系列
                </label>
                <select
                  id="series"
                  name="series"
                  value={formData.series}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">选择系列</option>
                  {seriesList.map(series => (
                    <option key={series._id} value={series._id}>
                      {series.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  视频链接 (可选)
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
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
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">发布</span>
                </label>
              </div>
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  内容
                </label>
                {/* 使用普通文本区域代替CKEditor */}
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
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

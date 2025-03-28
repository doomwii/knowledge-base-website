'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

interface ChapterEditProps {
  params: {
    slug: string;
  };
}

export default function ChapterEditPage({ params }: ChapterEditProps) {
  const { slug } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [chapterSlug, setChapterSlug] = useState('');
  const [content, setContent] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [order, setOrder] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // 检查用户是否已登录
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      // 加载系列数据和章节数据
      fetchSeries();
      fetchChapter();
    }
  }, [status, router, slug]);

  const fetchSeries = async () => {
    try {
      const response = await fetch('/api/series');
      if (response.ok) {
        const data = await response.json();
        setSeries(data);
      } else {
        setError('获取系列失败');
      }
    } catch (error) {
      setError('获取系列出错');
    }
  };

  const fetchChapter = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chapters/${slug}`);
      
      if (!response.ok) {
        throw new Error('章节获取失败');
      }
      
      const data = await response.json();
      
      // 填充表单数据
      setTitle(data.title || '');
      setChapterSlug(data.slug || '');
      setContent(data.content || '');
      setSeriesId(data.seriesId || '');
      setOrder(data.order || 0);
      setVideoUrl(data.videoUrl || '');
      setIsPublished(data.isPublished !== false);
      
    } catch (error) {
      console.error('获取章节出错:', error);
      setError('无法加载章节内容');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !chapterSlug || !seriesId) {
      setError('标题、别名和系列为必填项');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const chapterData = {
        title,
        slug: chapterSlug,
        content,
        seriesId,
        order: Number(order),
        videoUrl,
        isPublished
      };
      
      const response = await fetch(`/api/chapters/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chapterData),
      });
      
      if (response.ok) {
        setSuccess('章节更新成功');
        // 延迟跳转
        setTimeout(() => {
          router.push('/admin/chapters');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || '更新章节失败');
      }
    } catch (error) {
      setError('更新章节过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 根据标题自动生成别名
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // 只有在初始加载时自动生成别名
    if (!chapterSlug) {
      setChapterSlug(generateSlug(newTitle));
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
          <h1 className="text-2xl font-bold text-gray-900">编辑章节</h1>
          <div className="flex items-center space-x-4">
            <Link href="/admin/chapters" className="text-blue-600 hover:text-blue-800">
              返回章节列表
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-500 rounded-md">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  标题 *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="章节标题"
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
                  value={chapterSlug}
                  onChange={(e) => setChapterSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="章节别名（URL友好）"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="seriesId" className="block text-sm font-medium text-gray-700 mb-1">
                  所属系列 *
                </label>
                <select
                  id="seriesId"
                  value={seriesId}
                  onChange={(e) => setSeriesId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">选择系列</option>
                  {series.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
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
              
              <div className="md:col-span-2">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  视频URL（可选）
                </label>
                <input
                  id="videoUrl"
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YouTube、Bilibili或腾讯视频链接"
                />
                <p className="mt-1 text-sm text-gray-500">
                  支持YouTube、Bilibili和腾讯视频链接，将在章节顶部显示视频
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  内容
                </label>
                <div className="mt-1 border border-gray-300 rounded-md overflow-hidden">
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="请输入章节内容..."
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  可以使用富文本编辑器添加格式化文本、表格、图片和视频等内容
                </p>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    id="isPublished"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                    发布状态
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  取消勾选将保存为草稿状态
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/chapters"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {loading ? '保存中...' : '保存章节'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

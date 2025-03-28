'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoEmbed from '@/components/VideoEmbed';

interface ChapterPageProps {
  params: {
    slug: string;
  };
}

interface ChapterData {
  _id: string;
  title: string;
  content: string;
  videoUrl?: string;
  seriesId: string;
  series?: {
    name: string;
    slug: string;
    categoryId: string;
  };
  category?: {
    name: string;
    slug: string;
  };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = params;
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chapters/${slug}`);
        
        if (!response.ok) {
          throw new Error('章节获取失败');
        }
        
        const data = await response.json();
        setChapter(data);
      } catch (error) {
        console.error('获取章节出错:', error);
        setError('无法加载章节内容');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchChapter();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500">{error || '章节不存在'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center text-sm md:text-base">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              首页
            </Link>
            {chapter.category && (
              <>
                <span className="mx-2 text-gray-500">/</span>
                <Link href={`/category/${chapter.category.slug}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                  {chapter.category.name}
                </Link>
              </>
            )}
            {chapter.series && (
              <>
                <span className="mx-2 text-gray-500">/</span>
                <Link href={`/series/${chapter.series.slug}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                  {chapter.series.name}
                </Link>
              </>
            )}
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700 truncate">{chapter.title}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{chapter.title}</h1>
            
            {chapter.videoUrl && (
              <div className="mb-8">
                <VideoEmbed url={chapter.videoUrl} />
              </div>
            )}
            
            <div 
              className="prose prose-lg max-w-none mt-6"
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </div>
        </article>

        <div className="mt-8 flex justify-center">
          <Link 
            href={chapter.series ? `/series/${chapter.series.slug}` : '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回系列目录
          </Link>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">知识库</h2>
              <p className="text-gray-400 mt-1">© {new Date().getFullYear()} 版权所有</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                首页
              </Link>
              <Link href="/admin/login" className="text-gray-300 hover:text-white transition-colors">
                管理入口
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SeriesPageProps {
  params: {
    slug: string;
  };
}

export default function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = params;
  const [series, setSeries] = useState(null);
  const [category, setCategory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSeriesAndChapters = async () => {
      try {
        setLoading(true);
        
        // 获取系列信息
        const seriesResponse = await fetch(`/api/series/${slug}`);
        if (!seriesResponse.ok) {
          throw new Error('系列获取失败');
        }
        const seriesData = await seriesResponse.json();
        setSeries(seriesData);
        
        // 获取分类信息
        if (seriesData.categoryId) {
          const categoryResponse = await fetch(`/api/categories/${seriesData.categoryId}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategory(categoryData);
          }
        }
        
        // 获取该系列下的章节
        const chaptersResponse = await fetch(`/api/chapters?seriesId=${seriesData._id}`);
        if (!chaptersResponse.ok) {
          throw new Error('章节获取失败');
        }
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData);
        
      } catch (error) {
        console.error('获取数据出错:', error);
        setError('无法加载内容');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchSeriesAndChapters();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500">{error || '系列不存在'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <div className="mb-4">
              <Link href="/" className="text-white hover:text-blue-200 transition-colors">
                首页
              </Link>
              {category && (
                <>
                  <span className="mx-2">/</span>
                  <Link href={`/category/${category.slug}`} className="text-white hover:text-blue-200 transition-colors">
                    {category.name}
                  </Link>
                </>
              )}
              <span className="mx-2">/</span>
              <span>{series.name}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{series.name}</h1>
            {series.description && (
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                {series.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">章节列表</h2>

        {chapters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">该系列下暂无章节内容</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {chapters.map((chapter, index) => (
                <li key={chapter._id}>
                  <Link 
                    href={`/chapter/${chapter.slug}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-6 py-4 flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 text-indigo-800 font-semibold rounded-full w-10 h-10 flex items-center justify-center mr-4">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{chapter.title}</h3>
                        {chapter.videoUrl && (
                          <p className="mt-1 text-sm text-indigo-600">
                            <span className="inline-flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              包含视频
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8">
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

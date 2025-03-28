'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const [category, setCategory] = useState(null);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryAndSeries = async () => {
      try {
        setLoading(true);
        
        // 获取分类信息
        const categoryResponse = await fetch(`/api/categories/${slug}`);
        if (!categoryResponse.ok) {
          throw new Error('分类获取失败');
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);
        
        // 获取该分类下的系列
        const seriesResponse = await fetch(`/api/series?categoryId=${categoryData._id}`);
        if (!seriesResponse.ok) {
          throw new Error('系列获取失败');
        }
        const seriesData = await seriesResponse.json();
        setSeries(seriesData);
        
      } catch (error) {
        console.error('获取数据出错:', error);
        setError('无法加载内容');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndSeries();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-500">{error || '分类不存在'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <div className="mb-4">
              <Link href="/" className="text-white hover:text-blue-200 transition-colors">
                首页
              </Link>
              <span className="mx-2">/</span>
              <span>{category.name}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">系列内容</h2>

        {series.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">该分类下暂无系列内容</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/series/${item.slug}`} className="hover:text-blue-600 transition-colors">
                      {item.name}
                    </Link>
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                  )}
                  <Link 
                    href={`/series/${item.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    查看章节
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
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

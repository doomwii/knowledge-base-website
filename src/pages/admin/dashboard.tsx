import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-lg font-bold">知识库管理后台</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Link 
                href="/"
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                返回前台
              </Link>
              <button 
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => alert('已退出登录')}
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">仪表盘</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        总分类数
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        3
                      </dd>
                    </dl>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <Link 
                        href="/admin/categories" 
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        查看所有分类
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        总系列数
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        6
                      </dd>
                    </dl>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <Link 
                        href="/admin/series" 
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        查看所有系列
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        总章节数
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        12
                      </dd>
                    </dl>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <Link 
                        href="/admin/chapters" 
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        查看所有章节
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">快速操作</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        添加新内容
                      </h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>
                          添加新的分类、系列或章节内容。
                        </p>
                      </div>
                      <div className="mt-5">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => alert('此功能在静态演示中不可用')}
                        >
                          添加内容
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        网站设置
                      </h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>
                          管理网站的基本设置和配置。
                        </p>
                      </div>
                      <div className="mt-5">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => alert('此功能在静态演示中不可用')}
                        >
                          网站设置
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

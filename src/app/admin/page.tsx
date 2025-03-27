'use client';

import AuthCheck from '@/components/AuthCheck';
import AdminLayout from '@/components/AdminLayout';

export default function AdminPage() {
  return (
    <AuthCheck>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">知识库管理后台</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">分类管理</h2>
              <p className="text-gray-600 mb-4">创建和管理知识分类</p>
              <a href="/admin/categories" className="text-blue-500 hover:underline">
                管理分类 &rarr;
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">系列管理</h2>
              <p className="text-gray-600 mb-4">创建和管理知识系列</p>
              <a href="/admin/series" className="text-blue-500 hover:underline">
                管理系列 &rarr;
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">章节管理</h2>
              <p className="text-gray-600 mb-4">创建和管理章节内容</p>
              <a href="/admin/chapters" className="text-blue-500 hover:underline">
                管理章节 &rarr;
              </a>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthCheck>
  );
}

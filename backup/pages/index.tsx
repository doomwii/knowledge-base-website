import React from 'react';
import Link from 'next/link';

// 静态数据，确保页面能够正常显示
const categories = [
  {
    _id: "67e5f17a6a31bf959101ff71",
    slug: "ip-basics",
    title: "知识产权基础",
    description: "知识产权的基本概念、类型和保护方法"
  },
  {
    _id: "67e5f17a6a31bf959101ff73",
    slug: "patent-guide",
    title: "专利申请指南",
    description: "专利申请流程、注意事项和常见问题"
  },
  {
    _id: "67e5f17a6a31bf959101ff77",
    slug: "trademark-practice",
    title: "商标注册实务",
    description: "商标注册的流程、策略和案例分析"
  }
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-4xl">知识库首页</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            href={`/category/${category.slug}`} 
            key={category._id}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
            <p className="text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// 静态数据，确保页面能够正常显示
const categoriesData = {
  "ip-basics": {
    title: "知识产权基础",
    description: "知识产权的基本概念、类型和保护方法",
    series: [
      {
        _id: "67e5f17a6a31bf959101ff72",
        slug: "ip-overview",
        title: "知识产权概述",
        description: "介绍知识产权的基本概念和重要性"
      },
      {
        _id: "67e5f17a6a31bf959101ff7a",
        slug: "copyright-protection",
        title: "著作权保护",
        description: "著作权的保护范围和方法"
      }
    ]
  },
  "patent-guide": {
    title: "专利申请指南",
    description: "专利申请流程、注意事项和常见问题",
    series: [
      {
        _id: "67e5f17a6a31bf959101ff74",
        slug: "invention-patent",
        title: "发明专利申请",
        description: "发明专利的申请流程和要求"
      },
      {
        _id: "67e5f17a6a31bf959101ff75",
        slug: "patent-writing",
        title: "专利文件撰写",
        description: "专利文件的撰写技巧和注意事项"
      }
    ]
  },
  "trademark-practice": {
    title: "商标注册实务",
    description: "商标注册的流程、策略和案例分析",
    series: [
      {
        _id: "67e5f17a6a31bf959101ff78",
        slug: "trademark-registration",
        title: "商标注册流程",
        description: "商标注册的详细流程和注意事项"
      },
      {
        _id: "67e5f17a6a31bf959101ff79",
        slug: "trademark-cases",
        title: "商标侵权案例",
        description: "典型商标侵权案例分析和启示"
      }
    ]
  }
};

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  // 确保slug是字符串
  const categorySlug = typeof slug === 'string' ? slug : '';
  const category = categoriesData[categorySlug];
  
  if (!category) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">分类不存在</h1>
        <p className="text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            返回首页
          </Link>
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-center md:text-4xl">{category.title}</h1>
      <p className="text-gray-600 mb-6 text-center">{category.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.series.map((series) => (
          <Link 
            href={`/series/${series.slug}`} 
            key={series._id}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{series.title}</h2>
            <p className="text-gray-600">{series.description}</p>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  );
}

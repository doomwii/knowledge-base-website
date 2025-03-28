import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// 静态数据，确保页面能够正常显示
const seriesData = {
  "ip-overview": {
    title: "知识产权概述",
    description: "介绍知识产权的基本概念和重要性",
    categorySlug: "ip-basics",
    categoryTitle: "知识产权基础",
    chapters: [
      {
        _id: "67e5f17a6a31bf959101ff7b",
        slug: "what-is-ip",
        title: "什么是知识产权",
        description: "知识产权的定义、特点和分类"
      },
      {
        _id: "67e5f17a6a31bf959101ff7c",
        slug: "ip-importance",
        title: "知识产权的重要性",
        description: "知识产权对个人、企业和国家的重要意义"
      }
    ]
  },
  "copyright-protection": {
    title: "著作权保护",
    description: "著作权的保护范围和方法",
    categorySlug: "ip-basics",
    categoryTitle: "知识产权基础",
    chapters: [
      {
        _id: "67e5f17a6a31bf959101ff7d",
        slug: "copyright-basics",
        title: "著作权基础知识",
        description: "著作权的定义、客体和权利内容"
      },
      {
        _id: "67e5f17a6a31bf959101ff7e",
        slug: "copyright-registration",
        title: "著作权登记",
        description: "著作权登记的流程和注意事项"
      }
    ]
  },
  "invention-patent": {
    title: "发明专利申请",
    description: "发明专利的申请流程和要求",
    categorySlug: "patent-guide",
    categoryTitle: "专利申请指南",
    chapters: [
      {
        _id: "67e5f17a6a31bf959101ff7f",
        slug: "patent-requirements",
        title: "专利申请条件",
        description: "发明专利的新颖性、创造性和实用性要求"
      },
      {
        _id: "67e5f17a6a31bf959101ff80",
        slug: "patent-application-process",
        title: "专利申请流程",
        description: "发明专利从申请到授权的完整流程"
      }
    ]
  },
  "patent-writing": {
    title: "专利文件撰写",
    description: "专利文件的撰写技巧和注意事项",
    categorySlug: "patent-guide",
    categoryTitle: "专利申请指南",
    chapters: [
      {
        _id: "67e5f17a6a31bf959101ff81",
        slug: "claims-writing",
        title: "权利要求书撰写",
        description: "权利要求书的结构和撰写技巧"
      },
      {
        _id: "67e5f17a6a31bf959101ff82",
        slug: "specification-writing",
        title: "说明书撰写",
        description: "说明书的结构和撰写要点"
      }
    ]
  },
  "trademark-registration": {
    title: "商标注册流程",
    description: "商标注册的详细流程和注意事项",
    categorySlug: "trademark-practice",
    categoryTitle: "商标注册实务",
    chapters: [
      {
        _id: "67e5f17a6a31bf959101ff83",
        slug: "trademark-search",
        title: "商标查询",
        description: "商标注册前的查询方法和技巧"
      },
      {
        _id: "67e5f17a6a31bf959101ff84",
        slug: "trademark-application",
        title: "商标申请",
        description: "商标申请的流程和注意事项"
      }
    ]
  },
  "trademark-cases": {
    title: "商标侵权案例",
    description: "典型商标侵权案例分析和启示",
    categorySlug: "trademark-practice",
    categoryTitle: "商标注册实务",
    chapters: [
      {
        _id: "67e5f17a6a31bf959101ff85",
        slug: "famous-trademark-cases",
        title: "知名商标侵权案例",
        description: "国内外知名商标侵权案例分析"
      },
      {
        _id: "67e5f17a6a31bf959101ff86",
        slug: "trademark-protection",
        title: "商标保护策略",
        description: "企业商标保护的有效策略和方法"
      }
    ]
  }
};

export default function SeriesPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  // 确保slug是字符串
  const seriesSlug = typeof slug === 'string' ? slug : '';
  const series = seriesData[seriesSlug];
  
  if (!series) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">系列不存在</h1>
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
      <h1 className="text-3xl font-bold mb-2 text-center md:text-4xl">{series.title}</h1>
      <p className="text-gray-600 mb-2 text-center">{series.description}</p>
      <p className="text-sm text-gray-500 mb-6 text-center">
        分类：
        <Link href={`/category/${series.categorySlug}`} className="hover:underline">
          {series.categoryTitle}
        </Link>
      </p>
      
      <div className="space-y-4">
        {series.chapters.map((chapter) => (
          <Link 
            href={`/chapter/${chapter.slug}`} 
            key={chapter._id}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{chapter.title}</h2>
            <p className="text-gray-600">{chapter.description}</p>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link href={`/category/${series.categorySlug}`} className="text-blue-500 hover:underline mr-4">
          返回分类
        </Link>
        <Link href="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  );
}

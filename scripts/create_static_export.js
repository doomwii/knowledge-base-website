// 创建静态导出版本的脚本
require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('开始创建静态导出版本...');

// 1. 修改next.config.js，启用静态导出
const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
const staticNextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 启用静态导出
  output: 'export',
  // 禁用图像优化，这在静态导出中不支持
  images: {
    unoptimized: true,
  },
  // 添加环境变量配置
  env: {
    MONGODB_URI: "${process.env.MONGODB_URI}",
    NEXTAUTH_URL: "https://knowledge-base-website-theta.vercel.app",
    NEXTAUTH_SECRET: "${process.env.NEXTAUTH_SECRET || 'your_nextauth_secret_key_here'}",
    ADMIN_USERNAME: "${process.env.ADMIN_USERNAME || 'doomwang91'}",
    ADMIN_PASSWORD: "${process.env.ADMIN_PASSWORD || 'mina1995'}"
  },
};

module.exports = nextConfig;
`;

fs.writeFileSync(nextConfigPath, staticNextConfig);
console.log('已更新next.config.js配置为静态导出模式');

// 2. 创建一个简单的静态首页，确保能够显示内容
const staticIndexPath = path.join(__dirname, '..', 'src', 'pages', 'index.tsx');
const staticIndexDir = path.dirname(staticIndexPath);

// 确保目录存在
if (!fs.existsSync(staticIndexDir)) {
  fs.mkdirSync(staticIndexDir, { recursive: true });
}

const staticIndexContent = `import React from 'react';
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
            href={\`/category/\${category.slug}\`} 
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
`;

fs.writeFileSync(staticIndexPath, staticIndexContent);
console.log('已创建静态首页');

// 3. 创建静态分类页面
const staticCategoryPath = path.join(__dirname, '..', 'src', 'pages', 'category', '[slug].tsx');
const staticCategoryDir = path.dirname(staticCategoryPath);

// 确保目录存在
if (!fs.existsSync(staticCategoryDir)) {
  fs.mkdirSync(staticCategoryDir, { recursive: true });
}

const staticCategoryContent = `import React from 'react';
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
            href={\`/series/\${series.slug}\`} 
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
`;

fs.writeFileSync(staticCategoryPath, staticCategoryContent);
console.log('已创建静态分类页面');

// 4. 创建静态系列页面
const staticSeriesPath = path.join(__dirname, '..', 'src', 'pages', 'series', '[slug].tsx');
const staticSeriesDir = path.dirname(staticSeriesPath);

// 确保目录存在
if (!fs.existsSync(staticSeriesDir)) {
  fs.mkdirSync(staticSeriesDir, { recursive: true });
}

const staticSeriesContent = `import React from 'react';
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
        <Link href={\`/category/\${series.categorySlug}\`} className="hover:underline">
          {series.categoryTitle}
        </Link>
      </p>
      
      <div className="space-y-4">
        {series.chapters.map((chapter) => (
          <Link 
            href={\`/chapter/\${chapter.slug}\`} 
            key={chapter._id}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{chapter.title}</h2>
            <p className="text-gray-600">{chapter.description}</p>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link href={\`/category/\${series.categorySlug}\`} className="text-blue-500 hover:underline mr-4">
          返回分类
        </Link>
        <Link href="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(staticSeriesPath, staticSeriesContent);
console.log('已创建静态系列页面');

// 5. 创建静态章节页面
const staticChapterPath = path.join(__dirname, '..', 'src', 'pages', 'chapter', '[slug].tsx');
const staticChapterDir = path.dirname(staticChapterPath);

// 确保目录存在
if (!fs.existsSync(staticChapterDir)) {
  fs.mkdirSync(staticChapterDir, { recursive: true });
}

const staticChapterContent = `import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// 静态数据，确保页面能够正常显示
const chaptersData = {
  "what-is-ip": {
    title: "什么是知识产权",
    content: \`
      <h1 class="text-2xl font-bold mb-4">什么是知识产权</h1>
      
      <p class="mb-4">知识产权是指人们就其智力创造成果所依法享有的专有权利，通常表现为版权、专利、商标等形式。知识产权具有专有性、地域性、时间性等特点。</p>
      
      <h2 class="text-xl font-semibold mt-6 mb-3">知识产权的分类</h2>
      
      <p class="mb-4">知识产权主要分为以下几类：</p>
      
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2"><strong>著作权（版权）</strong>：保护文学、艺术和科学作品的权利。</li>
        <li class="mb-2"><strong>专利权</strong>：保护发明创造的权利，包括发明专利、实用新型专利和外观设计专利。</li>
        <li class="mb-2"><strong>商标权</strong>：保护商品和服务标志的权利。</li>
        <li class="mb-2"><strong>商业秘密权</strong>：保护不为公众所知的商业信息的权利。</li>
        <li class="mb-2"><strong>地理标志权</strong>：保护标示某商品来源于某地区，且该商品的特定质量、信誉或其他特征主要由该地区的自然因素或人文因素所决定的标志的权利。</li>
      </ul>
      
      <h2 class="text-xl font-semibold mt-6 mb-3">知识产权的特点</h2>
      
      <p class="mb-4">知识产权具有以下特点：</p>
      
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2"><strong>无形性</strong>：知识产权的客体是智力成果，具有无形性。</li>
        <li class="mb-2"><strong>专有性</strong>：知识产权是专有权利，权利人对其智力成果享有排他的权利。</li>
        <li class="mb-2"><strong>地域性</strong>：知识产权的保护通常限于特定国家或地区。</li>
        <li class="mb-2"><strong>时间性</strong>：知识产权的保护期限是有限的，期满后进入公有领域。</li>
      </ol>
    \`,
    seriesSlug: "ip-overview",
    seriesTitle: "知识产权概述",
    categorySlug: "ip-basics",
    categoryTitle: "知识产权基础"
  },
  "ip-importance": {
    title: "知识产权的重要性",
    content: \`
      <h1 class="text-2xl font-bold mb-4">知识产权的重要性</h1>
      
      <p class="mb-4">知识产权在现代社会中具有重要的意义，对个人、企业和国家都有深远的影响。</p>
      
      <h2 class="text-xl font-semibold mt-6 mb-3">对个人的重要性</h2>
      
      <p class="mb-4">对个人而言，知识产权保护可以：</p>
      
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">保护创作者的智力成果，确保其获得应有的回报。</li>
        <li class="mb-2">激励个人的创新和创作积极性。</li>
        <li class="mb-2">为个人提供将创意转化为商业价值的途径。</li>
      </ul>
      
      <h2 class="text-xl font-semibold mt-6 mb-3">对企业的重要性</h2>
      
      <p class="mb-4">对企业而言，知识产权保护可以：</p>
      
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">保护企业的创新成果和商业标识，维护市场竞争优势。</li>
        <li class="mb-2">增加企业的无形资产价值，提升企业整体价值。</li>
        <li class="mb-2">为企业提供新的盈利模式，如许可使用、转让等。</li>
        <li class="mb-2">防止他人侵权，维护企业的合法权益。</li>
      </ul>
      
      <h2 class="text-xl font-semibold mt-6 mb-3">对国家的重要性</h2>
      
      <p class="mb-4">对国家而言，知识产权保护可以：</p>
      
      <ul class="list-disc pl-6 mb-4">
        <li class="mb-2">促进科技创新和文化创作，推动国家经济和文化发展。</li>
        <li class="mb-2">吸引外国投资和技术转让，促进国际合作。</li>
        <li class="mb-2">提升国家的国际竞争力和科技实力。</li>
        <li class="mb-2">维护国家的经济安全和文化安全。</li>
      </ul>
      
      <h2 class="text-xl font-semibold mt-6 mb-3">知识产权保护的挑战</h2>
      
      <p class="mb-4">尽管知识产权保护非常重要，但在实践中也面临一些挑战：</p>
      
      <ol class="list-decimal pl-6 mb-4">
        <li class="mb-2">数字时代侵权行为更加容易，保护难度增加。</li>
        <li class="mb-2">知识产权保护与公共利益之间的平衡问题。</li>
        <li class="mb-2">发展中国家与发达国家在知识产权保护标准上的差异。</li>
        <li class="mb-2">知识产权执法的困难和成本问题。</li>
      </ol>
    \`,
    seriesSlug: "ip-overview",
    seriesTitle: "知识产权概述",
    categorySlug: "ip-basics",
    categoryTitle: "知识产权基础"
  }
};

export default function ChapterPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  // 确保slug是字符串
  const chapterSlug = typeof slug === 'string' ? slug : '';
  const chapter = chaptersData[chapterSlug];
  
  if (!chapter) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">章节不存在</h1>
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
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">首页</Link> &gt; 
        <Link href={\`/category/\${chapter.categorySlug}\`} className="hover:underline ml-1">
          {chapter.categoryTitle}
        </Link> &gt; 
        <Link href={\`/series/\${chapter.seriesSlug}\`} className="hover:underline ml-1">
          {chapter.seriesTitle}
        </Link> &gt; 
        <span className="ml-1">{chapter.title}</span>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
      </div>
      
      <div className="mt-8 text-center">
        <Link href={\`/series/\${chapter.seriesSlug}\`} className="text-blue-500 hover:underl<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>
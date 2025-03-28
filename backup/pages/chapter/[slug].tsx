import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// 静态数据，确保页面能够正常显示
const chaptersData = {
  "what-is-ip": {
    title: "什么是知识产权",
    content: `
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
    `,
    seriesSlug: "ip-overview",
    seriesTitle: "知识产权概述",
    categorySlug: "ip-basics",
    categoryTitle: "知识产权基础"
  },
  "ip-importance": {
    title: "知识产权的重要性",
    content: `
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
    `,
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
        <Link href={`/category/${chapter.categorySlug}`} className="hover:underline ml-1">
          {chapter.categoryTitle}
        </Link> &gt; 
        <Link href={`/series/${chapter.seriesSlug}`} className="hover:underline ml-1">
          {chapter.seriesTitle}
        </Link> &gt; 
        <span className="ml-1">{chapter.title}</span>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
      </div>
      
      <div className="mt-8 text-center">
        <Link href={`/series/${chapter.seriesSlug}`} className="text-blue-500 hover:underline mr-4">
          返回系列
        </Link>
        <Link href={`/category/${chapter.categorySlug}`} className="text-blue-500 hover:underline mr-4">
          返回分类
        </Link>
        <Link href="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  );
}

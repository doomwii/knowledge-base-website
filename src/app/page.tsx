import FrontendLayout from '@/components/frontend/Layout';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export default async function HomePage() {
  await dbConnect();
  const categories = await Category.find({}).sort({ order: 1 });
  
  return (
    <FrontendLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-4xl">知识库首页</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: CategoryType) => (
            <Link 
              href={`/category/${category.slug}`} 
              key={category._id}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
        
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无分类数据，请先添加分类内容。</p>
            <Link href="/admin" className="text-blue-500 hover:underline mt-2 inline-block">
              前往管理后台
            </Link>
          </div>
        )}
      </div>
    </FrontendLayout>
  );
}

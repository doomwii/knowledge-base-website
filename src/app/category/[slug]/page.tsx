import FrontendLayout from '@/components/frontend/Layout';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Series from '@/models/Series';

interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

interface SeriesType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  order: number;
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  
  await dbConnect();
  const category = await Category.findOne({ slug });
  
  if (!category) {
    return (
      <FrontendLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">分类不存在</h1>
          <p className="text-gray-600 mb-4">您访问的分类不存在或已被删除。</p>
          <Link href="/" className="text-blue-500 hover:underline">
            返回首页
          </Link>
        </div>
      </FrontendLayout>
    );
  }
  
  const seriesList = await Series.find({ category: category._id }).sort({ order: 1 });
  
  return (
    <FrontendLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline">
            首页
          </Link>
          {' > '}
          <span>{category.name}</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mb-8">{category.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seriesList.map((series: SeriesType) => (
            <Link 
              href={`/series/${series.slug}`} 
              key={series._id}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-2">{series.name}</h2>
              <p className="text-gray-600">{series.description}</p>
            </Link>
          ))}
        </div>
        
        {seriesList.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">该分类下暂无系列内容。</p>
          </div>
        )}
      </div>
    </FrontendLayout>
  );
}

export async function generateStaticParams() {
  await dbConnect();
  const categories = await Category.find({});
  
  return categories.map((category: CategoryType) => ({
    slug: category.slug,
  }));
}

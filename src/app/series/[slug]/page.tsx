import FrontendLayout from '@/components/frontend/Layout';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Series from '@/models/Series';
import Chapter from '@/models/Chapter';
import Category from '@/models/Category';

interface SeriesType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
}

interface ChapterType {
  _id: string;
  title: string;
  slug: string;
  series: string;
  order: number;
  published: boolean;
}

interface CategoryType {
  _id: string;
  name: string;
  slug: string;
}

interface SeriesPageProps {
  params: {
    slug: string;
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = params;
  
  await dbConnect();
  const series = await Series.findOne({ slug });
  
  if (!series) {
    return (
      <FrontendLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">系列不存在</h1>
          <p className="text-gray-600 mb-4">您访问的系列不存在或已被删除。</p>
          <Link href="/" className="text-blue-500 hover:underline">
            返回首页
          </Link>
        </div>
      </FrontendLayout>
    );
  }
  
  const category = await Category.findById(series.category);
  const chapters = await Chapter.find({ 
    series: series._id,
    published: true 
  }).sort({ order: 1 });
  
  return (
    <FrontendLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline">
            首页
          </Link>
          {' > '}
          {category && (
            <>
              <Link href={`/category/${category.slug}`} className="text-blue-500 hover:underline">
                {category.name}
              </Link>
              {' > '}
            </>
          )}
          <span>{series.name}</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{series.name}</h1>
        {series.description && (
          <p className="text-gray-600 mb-8">{series.description}</p>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">章节列表</h2>
          
          {chapters.length > 0 ? (
            <ul className="divide-y">
              {chapters.map((chapter: ChapterType) => (
                <li key={chapter._id} className="py-3">
                  <Link 
                    href={`/chapter/${chapter.slug}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <span className="mr-2">{chapter.order + 1}.</span>
                    <span>{chapter.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">该系列下暂无章节内容。</p>
            </div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
}

export async function generateStaticParams() {
  await dbConnect();
  const seriesList = await Series.find({});
  
  return seriesList.map((series: SeriesType) => ({
    slug: series.slug,
  }));
}

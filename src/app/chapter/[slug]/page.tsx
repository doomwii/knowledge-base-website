import FrontendLayout from '@/components/frontend/Layout';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import Series from '@/models/Series';
import Category from '@/models/Category';

interface ChapterType {
  _id: string;
  title: string;
  slug: string;
  content: string;
  videoUrl: string;
  series: string;
  order: number;
}

interface SeriesType {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

interface CategoryType {
  _id: string;
  name: string;
  slug: string;
}

interface ChapterPageProps {
  params: {
    slug: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = params;
  
  await dbConnect();
  const chapter = await Chapter.findOne({ 
    slug,
    published: true
  });
  
  if (!chapter) {
    return (
      <FrontendLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">章节不存在</h1>
          <p className="text-gray-600 mb-4">您访问的章节不存在、未发布或已被删除。</p>
          <Link href="/" className="text-blue-500 hover:underline">
            返回首页
          </Link>
        </div>
      </FrontendLayout>
    );
  }
  
  const series = await Series.findById(chapter.series);
  const category = series ? await Category.findById(series.category) : null;
  
  // 获取前后章节
  const chapters = await Chapter.find({ 
    series: chapter.series,
    published: true
  }).sort({ order: 1 });
  
  const currentIndex = chapters.findIndex(c => c._id.toString() === chapter._id.toString());
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  
  return (
    <FrontendLayout>
      <div className="max-w-4xl mx-auto">
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
          {series && (
            <>
              <Link href={`/series/${series.slug}`} className="text-blue-500 hover:underline">
                {series.name}
              </Link>
              {' > '}
            </>
          )}
          <span>{chapter.title}</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{chapter.title}</h1>
        
        {chapter.videoUrl && (
          <div className="mb-8">
            <div className="aspect-w-16 aspect-h-9 relative">
              <iframe 
                src={chapter.videoUrl} 
                className="absolute w-full h-full"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}
        
        <div className="prose prose-blue max-w-none bg-white rounded-lg shadow-md p-6 mb-8">
          <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
        </div>
        
        <div className="flex justify-between items-center mt-8">
          {prevChapter ? (
            <Link 
              href={`/chapter/${prevChapter.slug}`}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一章：{prevChapter.title}
            </Link>
          ) : (
            <div></div>
          )}
          
          {nextChapter ? (
            <Link 
              href={`/chapter/${nextChapter.slug}`}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center"
            >
              下一章：{nextChapter.title}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
}

export async function generateStaticParams() {
  await dbConnect();
  const chapters = await Chapter.find({ published: true });
  
  return chapters.map((chapter: ChapterType) => ({
    slug: chapter.slug,
  }));
}

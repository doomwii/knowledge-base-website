'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthCheck from '@/components/AuthCheck';
import AdminLayout from '@/components/AdminLayout';
import dynamic from 'next/dynamic';

// 动态导入CKEditor组件，避免SSR问题
const CKEditor = dynamic(
  () => import('@ckeditor/ckeditor5-react').then(mod => ({ default: mod.CKEditor })),
  { ssr: false }
);

const ClassicEditor = dynamic(
  () => import('@ckeditor/ckeditor5-build-classic'),
  { ssr: false }
);

interface ChapterFormProps {
  params: {
    id: string;
  };
}

interface Series {
  _id: string;
  name: string;
}

interface ChapterData {
  title: string;
  slug: string;
  content: string;
  series: string;
  videoUrl: string;
  order: number;
  published: boolean;
}

export default function ChapterForm({ params }: ChapterFormProps) {
  const router = useRouter();
  const { id } = params;
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState<ChapterData>({
    title: '',
    slug: '',
    content: '',
    series: '',
    videoUrl: '',
    order: 0,
    published: false
  });
  
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    setEditorLoaded(true);
    
    // 获取所有系列
    const fetchSeries = async () => {
      try {
        const response = await fetch('/api/series');
        if (!response.ok) {
          throw new Error('获取系列数据失败');
        }
        const data = await response.json();
        setSeriesList(data);
      } catch (err) {
        setError('获取系列数据时出错');
        console.error(err);
      }
    };

    fetchSeries();

    // 如果是编辑模式，获取章节数据
    if (!isNew) {
      const fetchChapter = async () => {
        try {
          const response = await fetch(`/api/chapters/${id}`);
          if (!response.ok) {
            throw new Error('获取章节数据失败');
          }
          const data = await response.json();
          setFormData(data);
        } catch (err) {
          setError('获取章节数据时出错');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchChapter();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'order' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isNew ? '/api/chapters' : `/api/chapters/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('保存章节失败');
      }

      router.push('/admin/chapters');
      router.refresh();
    } catch (err) {
      setError('保存章节时出错');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthCheck>
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isNew ? '添加章节' : '编辑章节'}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  章节标题
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={() => !formData.slug && generateSlug()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL标识符)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="bg-gray-200 px-3 py-2 rounded-r-md hover:bg-gray-300"
                  >
                    生成
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="series" className="block text-sm font-medium text-gray-700 mb-1">
                  所属系列
                </label>
                <select
                  id="series"
                  name="series"
                  value={formData.series}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">选择系列</option>
                  {seriesList.map(series => (
                    <option key={series._id} value={series._id}>
                      {series.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  视频链接 (可选)
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                  排序
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">发布</span>
                </label>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  内容
                </label>
                {editorLoaded ? (
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.content}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFormData(prev => ({
                        ...prev,
                        content: data
                      }));
                    }}
                    config={{
                      toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'blockQuote',
                        'insertTable',
                        'undo',
                        'redo'
                      ]
                    }}
                  />
                ) : (
                  <div>编辑器加载中...</div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          )}
        </div>
      </AdminLayout>
    </AuthCheck>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/RichTextEditor';
import VideoEmbed from '@/components/VideoEmbed';

interface ChapterFormProps {
  initialData?: {
    _id?: string;
    title: string;
    slug: string;
    content: string;
    videoUrl?: string;
    series: string;
    order: number;
  };
  seriesList: Array<{
    _id: string;
    name: string;
  }>;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
}

const ChapterForm: React.FC<ChapterFormProps> = ({
  initialData = { title: '', slug: '', content: '', series: '', order: 0 },
  seriesList,
  onSubmit,
  isEditing = false
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      router.push('/admin/chapters');
    } catch (error) {
      console.error('提交失败:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标题
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={() => !isEditing && !formData.slug && generateSlug()}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL)
          </label>
          <div className="flex">
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
            >
              生成
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            所属系列
          </label>
          <select
            name="series"
            value={formData.series}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">选择系列</option>
            {seriesList.map(series => (
              <option key={series._id} value={series._id}>
                {series.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            排序
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          视频URL (可选)
        </label>
        <div className="flex">
          <input
            type="text"
            name="videoUrl"
            value={formData.videoUrl || ''}
            onChange={handleChange}
            placeholder="例如: https://www.youtube.com/watch?v=..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setPreviewVideo(!previewVideo)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
          >
            {previewVideo ? '隐藏预览' : '预览'}
          </button>
        </div>
      </div>
      
      {previewVideo && formData.videoUrl && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">视频预览:</h3>
          <VideoEmbed url={formData.videoUrl} height="300px" />
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          内容
        </label>
        <RichTextEditor 
          value={formData.content} 
          onChange={handleContentChange} 
          placeholder="请输入章节内容..."
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? '保存中...' : isEditing ? '更新章节' : '创建章节'}
        </button>
      </div>
    </form>
  );
};

export default ChapterForm;

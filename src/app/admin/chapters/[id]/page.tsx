import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import AuthCheck from '@/components/AuthCheck';
import AdminLayout from '@/components/AdminLayout';

// 动态导入CKEditor组件，避免SSR问题
const CKEditor = dynamic(
  () => import('@ckeditor/ckeditor5-react').then(mod => ({ default: mod.CKEditor })),
  { ssr: false }
);

// 修复ClassicEditor导入方式，解决类型兼容性问题
const ClassicEditor = dynamic(
  () => import('@ckeditor/ckeditor5-build-classic').then(mod => mod.default),
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
  videoUrl?: string;
  order: number;
  published: boolean;
}

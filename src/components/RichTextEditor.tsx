'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// 动态导入ReactQuill以避免SSR问题
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse"></div>,
});

// 自定义视频嵌入处理器
const videoEmbedHandler = () => {
  const url = prompt('请输入视频URL (YouTube, Bilibili, 腾讯视频等):');
  if (url) {
    // 获取编辑器实例
    const quill = (window as any).quillInstance;
    
    // 创建视频嵌入HTML
    let embedHtml = '';
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        embedHtml = `<iframe src="https://www.youtube.com/embed/${match[1]}" frameborder="0" allowfullscreen="true" width="100%" height="400"></iframe>`;
      }
    }
    
    // Bilibili
    else if (url.includes('bilibili.com')) {
      const bilibiliRegex = /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/;
      const match = url.match(bilibiliRegex);
      if (match && match[1]) {
        embedHtml = `<iframe src="https://player.bilibili.com/player.html?bvid=${match[1]}&high_quality=1" frameborder="0" allowfullscreen="true" width="100%" height="400"></iframe>`;
      }
    }
    
    // 腾讯视频
    else if (url.includes('v.qq.com')) {
      const qqRegex = /v\.qq\.com\/x\/page\/([a-zA-Z0-9]+)\.html/;
      const match = url.match(qqRegex);
      if (match && match[1]) {
        embedHtml = `<iframe src="https://v.qq.com/txp/iframe/player.html?vid=${match[1]}" frameborder="0" allowfullscreen="true" width="100%" height="400"></iframe>`;
      }
    }
    
    // 如果没有匹配到特定格式，使用通用iframe
    else {
      embedHtml = `<div class="video-embed" data-url="${url}"><iframe src="${url}" frameborder="0" allowfullscreen="true" width="100%" height="400"></iframe></div>`;
    }
    
    // 插入HTML到编辑器
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, 'video', url);
    quill.insertText(range.index + 1, '\n', 'user');
    quill.setSelection(range.index + 2);
  }
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = '请输入内容...' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 清理函数
    return () => {
      delete (window as any).quillInstance;
    };
  }, []);

  // 使用全局事件监听器来获取编辑器实例
  useEffect(() => {
    if (mounted) {
      // 使用setTimeout确保ReactQuill已经渲染完成
      const timer = setTimeout(() => {
        const editor = document.querySelector('.ql-editor');
        if (editor) {
          const quill = (editor as any).__quill;
          if (quill) {
            (window as any).quillInstance = quill;
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['link', 'image', 'video'],
        [{ color: [] }, { background: [] }],
        ['clean'],
        [{ table: {} }],
      ],
      handlers: {
        'video': videoEmbedHandler
      }
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'bullet', 'indent',
    'size', 'link', 'image', 'video',
    'color', 'background', 'table'
  ];

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  if (!mounted) {
    return (
      <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">编辑器加载中...</p>
      </div>
    );
  }

  // @ts-ignore - 忽略TypeScript类型错误
  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[300px]"
      />
      <div className="mt-2 text-sm text-gray-500">
        提示: 点击视频按钮可以嵌入YouTube、Bilibili或腾讯视频
      </div>
    </div>
  );
};

export default RichTextEditor;

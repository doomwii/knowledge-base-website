'use client';

import React, { useEffect, useRef } from 'react';

interface VideoEmbedProps {
  url: string;
  title?: string;
  width?: string;
  height?: string;
  className?: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({
  url,
  title = '嵌入视频',
  width = '100%',
  height = '400px',
  className = '',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 处理不同类型的视频URL
  const getEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    // Bilibili
    if (url.includes('bilibili.com')) {
      const bilibiliRegex = /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/;
      const match = url.match(bilibiliRegex);
      if (match && match[1]) {
        return `https://player.bilibili.com/player.html?bvid=${match[1]}&high_quality=1`;
      }
    }
    
    // 腾讯视频
    if (url.includes('v.qq.com')) {
      const qqRegex = /v\.qq\.com\/x\/page\/([a-zA-Z0-9]+)\.html/;
      const match = url.match(qqRegex);
      if (match && match[1]) {
        return `https://v.qq.com/txp/iframe/player.html?vid=${match[1]}`;
      }
    }
    
    // 如果没有匹配到特定格式，直接返回原URL
    return url;
  };

  const embedUrl = getEmbedUrl(url);
  
  // 添加响应式调整
  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current) {
        // 根据容器宽度调整高度，保持16:9比例
        const width = iframeRef.current.clientWidth;
        const aspectRatio = 9 / 16;
        const calculatedHeight = width * aspectRatio;
        iframeRef.current.style.height = `${calculatedHeight}px`;
      }
    };

    // 初始调整
    handleResize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`video-embed-container ${className} relative overflow-hidden rounded-lg shadow-md`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        width={width}
        height={height}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full"
      ></iframe>
    </div>
  );
};

export default VideoEmbed;

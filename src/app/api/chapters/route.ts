import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/chapters - 获取所有章节
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const seriesId = url.searchParams.get('seriesId');
    
    let query = {};
    if (seriesId) {
      query = { seriesId };
    }
    
    // @ts-ignore - 忽略TypeScript类型错误
    const chapters = await Chapter.find(query).sort({ order: 1 });
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('获取章节失败:', error);
    return NextResponse.json({ error: '获取章节失败' }, { status: 500 });
  }
}

// POST /api/chapters - 创建新章节
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // 验证必填字段
    if (!data.title || !data.slug || !data.seriesId) {
      return NextResponse.json({ error: '标题、别名和系列为必填项' }, { status: 400 });
    }
    
    await dbConnect();
    
    // 检查别名是否已存在
    // @ts-ignore - 忽略TypeScript类型错误
    const existingChapter = await Chapter.findOne({ slug: data.slug });
    if (existingChapter) {
      return NextResponse.json({ error: '该别名已被使用' }, { status: 400 });
    }
    
    // 创建新章节
    // @ts-ignore - 忽略TypeScript类型错误
    const chapter = await Chapter.create({
      title: data.title,
      slug: data.slug,
      content: data.content || '',
      seriesId: data.seriesId,
      order: data.order || 0,
      videoUrl: data.videoUrl || '',
      isPublished: data.isPublished !== false
    });
    
    return NextResponse.json(chapter);
  } catch (error) {
    console.error('创建章节失败:', error);
    return NextResponse.json({ error: '创建章节失败' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import Series from '@/models/Series';
import Category from '@/models/Category';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/chapters/[slug] - 获取单个章节
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    await dbConnect();
    
    // @ts-ignore - 忽略TypeScript类型错误
    const chapter = await Chapter.findOne({ slug });
    
    if (!chapter) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 });
    }
    
    // 获取系列信息
    // @ts-ignore - 忽略TypeScript类型错误
    const series = await Series.findById(chapter.seriesId);
    
    // 获取分类信息
    let category = null;
    if (series) {
      // @ts-ignore - 忽略TypeScript类型错误
      category = await Category.findById(series.categoryId);
    }
    
    // 合并数据
    const result = {
      ...chapter.toObject(),
      series: series ? {
        name: series.name,
        slug: series.slug,
        categoryId: series.categoryId
      } : null,
      category: category ? {
        name: category.name,
        slug: category.slug
      } : null
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('获取章节失败:', error);
    return NextResponse.json({ error: '获取章节失败' }, { status: 500 });
  }
}

// PUT /api/chapters/[slug] - 更新章节
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const { slug } = params;
    const data = await request.json();
    
    // 验证必填字段
    if (!data.title || !data.slug || !data.seriesId) {
      return NextResponse.json({ error: '标题、别名和系列为必填项' }, { status: 400 });
    }
    
    await dbConnect();
    
    // 检查别名是否已被其他章节使用
    // @ts-ignore - 忽略TypeScript类型错误
    const existingChapter = await Chapter.findOne({ 
      slug: data.slug,
      _id: { $ne: data._id }
    });
    
    if (existingChapter) {
      return NextResponse.json({ error: '该别名已被使用' }, { status: 400 });
    }
    
    // 更新章节
    // @ts-ignore - 忽略TypeScript类型错误
    const chapter = await Chapter.findOneAndUpdate(
      { slug },
      {
        title: data.title,
        slug: data.slug,
        content: data.content,
        seriesId: data.seriesId,
        order: data.order || 0,
        videoUrl: data.videoUrl || '',
        isPublished: data.isPublished !== false
      },
      { new: true }
    );
    
    if (!chapter) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 });
    }
    
    return NextResponse.json(chapter);
  } catch (error) {
    console.error('更新章节失败:', error);
    return NextResponse.json({ error: '更新章节失败' }, { status: 500 });
  }
}

// DELETE /api/chapters/[slug] - 删除章节
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const { slug } = params;
    
    await dbConnect();
    
    // 删除章节
    // @ts-ignore - 忽略TypeScript类型错误
    const result = await Chapter.findOneAndDelete({ slug });
    
    if (!result) {
      return NextResponse.json({ error: '章节不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除章节失败:', error);
    return NextResponse.json({ error: '删除章节失败' }, { status: 500 });
  }
}

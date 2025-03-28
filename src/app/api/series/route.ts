import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Series from '@/models/Series';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/series - 获取所有系列
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    
    let query = {};
    if (categoryId) {
      query = { categoryId };
    }
    
    // @ts-ignore - 忽略TypeScript类型错误
    const series = await Series.find(query).sort({ order: 1 });
    return NextResponse.json(series);
  } catch (error) {
    console.error('获取系列失败:', error);
    return NextResponse.json({ error: '获取系列失败' }, { status: 500 });
  }
}

// POST /api/series - 创建新系列
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // 验证必填字段
    if (!data.name || !data.slug || !data.categoryId) {
      return NextResponse.json({ error: '名称、别名和分类为必填项' }, { status: 400 });
    }
    
    await dbConnect();
    
    // 检查别名是否已存在
    // @ts-ignore - 忽略TypeScript类型错误
    const existingSeries = await Series.findOne({ slug: data.slug });
    if (existingSeries) {
      return NextResponse.json({ error: '该别名已被使用' }, { status: 400 });
    }
    
    // 创建新系列
    // @ts-ignore - 忽略TypeScript类型错误
    const series = await Series.create({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      categoryId: data.categoryId,
      order: data.order || 0
    });
    
    return NextResponse.json(series);
  } catch (error) {
    console.error('创建系列失败:', error);
    return NextResponse.json({ error: '创建系列失败' }, { status: 500 });
  }
}

// DELETE /api/series/:id - 删除系列
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: '缺少ID参数' }, { status: 400 });
    }
    
    await dbConnect();
    
    // 删除系列
    // @ts-ignore - 忽略TypeScript类型错误
    const result = await Series.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ error: '系列不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除系列失败:', error);
    return NextResponse.json({ error: '删除系列失败' }, { status: 500 });
  }
}

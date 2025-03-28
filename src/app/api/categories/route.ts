import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/categories - 获取所有分类
export async function GET() {
  try {
    await dbConnect();
    // @ts-ignore - 忽略TypeScript类型错误
    const categories = await Category.find({}).sort({ order: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
  }
}

// POST /api/categories - 创建新分类
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // 验证必填字段
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: '名称和别名为必填项' }, { status: 400 });
    }
    
    await dbConnect();
    
    // 检查别名是否已存在
    // @ts-ignore - 忽略TypeScript类型错误
    const existingCategory = await Category.findOne({ slug: data.slug });
    if (existingCategory) {
      return NextResponse.json({ error: '该别名已被使用' }, { status: 400 });
    }
    
    // 创建新分类
    // @ts-ignore - 忽略TypeScript类型错误
    const category = await Category.create({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      order: data.order || 0
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json({ error: '创建分类失败' }, { status: 500 });
  }
}

// DELETE /api/categories/:id - 删除分类
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
    
    // 删除分类
    // @ts-ignore - 忽略TypeScript类型错误
    const result = await Category.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ error: '分类不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除分类失败:', error);
    return NextResponse.json({ error: '删除分类失败' }, { status: 500 });
  }
}

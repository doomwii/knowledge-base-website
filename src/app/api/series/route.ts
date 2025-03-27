import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Series from '@/models/Series';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const series = await Series.find({}).sort({ order: 1 });
    
    // 获取分类信息以便前端显示
    const seriesWithCategory = await Promise.all(
      series.map(async (item) => {
        const seriesObj = item.toObject();
        try {
          const category = await Category.findById(seriesObj.category);
          if (category) {
            seriesObj.categoryName = category.name;
          }
        } catch (error) {
          console.error('Error fetching category:', error);
        }
        return seriesObj;
      })
    );
    
    return NextResponse.json(seriesWithCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    const data = await request.json();
    const series = await Series.create(data);
    return NextResponse.json(series, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

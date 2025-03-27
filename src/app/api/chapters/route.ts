import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Chapter from '@/models/Chapter';
import Series from '@/models/Series';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const seriesId = searchParams.get('series');
    
    let query = {};
    if (seriesId) {
      query = { series: seriesId };
    }
    
    const chapters = await Chapter.find(query).sort({ order: 1 });
    
    // 获取系列信息以便前端显示
    const chaptersWithSeries = await Promise.all(
      chapters.map(async (item) => {
        const chapterObj = item.toObject();
        try {
          const series = await Series.findById(chapterObj.series);
          if (series) {
            chapterObj.seriesName = series.name;
          }
        } catch (error) {
          console.error('Error fetching series:', error);
        }
        return chapterObj;
      })
    );
    
    return NextResponse.json(chaptersWithSeries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
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
    const chapter = await Chapter.create(data);
    return NextResponse.json(chapter, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

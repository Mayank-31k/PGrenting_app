import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import PG from '@/lib/models/PG';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB();
    
    const pg = await PG.findById(id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      });
    
    if (!pg) {
      return NextResponse.json(
        { error: 'PG not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(pg);
  } catch (error) {
    console.error('Get PG error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
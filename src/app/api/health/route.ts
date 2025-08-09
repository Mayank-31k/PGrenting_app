import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/lib/models/User';
import PG from '@/lib/models/PG';
import Inquiry from '@/lib/models/Inquiry';

export async function GET() {
  try {
    await connectDB();
    
    const userCount = await User.countDocuments();
    const pgCount = await PG.countDocuments();
    const inquiryCount = await Inquiry.countDocuments();
    
    return NextResponse.json({
      status: 'OK',
      database: 'connected',
      users: userCount,
      pgs: pgCount,
      inquiries: inquiryCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'ERROR',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
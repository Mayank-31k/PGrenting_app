import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import PG from '@/lib/models/PG';

// List of valid fallback images from your sample data
const fallbackImages = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=300&fit=crop"
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Find all PGs with images
    const pgs = await PG.find({});
    let updatedCount = 0;
    
    for (const pg of pgs) {
      let needsUpdate = false;
      
      // Check each image
      for (let i = 0; i < pg.images.length; i++) {
        const imageUrl = pg.images[i].url;
        
        // Check if the image returns 404
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' });
          if (!response.ok) {
            // Replace with a random fallback image
            const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
            pg.images[i].url = randomFallback;
            needsUpdate = true;
          }
        } catch (error) {
          // If fetch fails, also replace with fallback
          const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
          pg.images[i].url = randomFallback;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await pg.save();
        updatedCount++;
      }
    }
    
    return NextResponse.json({
      message: `Successfully updated ${updatedCount} PGs with valid images`,
      updatedCount
    });
  } catch (error) {
    console.error('Image cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup images' },
      { status: 500 }
    );
  }
}
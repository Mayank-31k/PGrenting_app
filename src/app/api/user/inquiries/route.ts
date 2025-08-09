import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/lib/models/User';
import Inquiry from '@/lib/models/Inquiry';
import PG from '@/lib/models/PG';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header found');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: { userId: string; email?: string };

    console.log('Received token for inquiry fetch:', token.substring(0, 20) + '...');

    try {
      // Try JWT first
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email?: string };
      console.log('JWT decoded successfully:', decoded);
    } catch (error) {
      // Try base64 decode for demo tokens
      try {
        const decodedToken = JSON.parse(atob(token));
        decoded = { userId: decodedToken.id, email: decodedToken.email };
        console.log('Base64 decoded token:', decoded);
      } catch (decodeError) {
        console.error('Token verification error:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Find user by multiple methods - try email first, then userId, then by all records with matching email
    let user;
    try {
      // Method 1: Try to find by userId if it's a valid ObjectId
      if (decoded.userId && decoded.userId.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(decoded.userId);
        console.log('User found by ID:', user ? user.email : 'Not found');
      }
      
      // Method 2: If no user found by ID, try by email
      if (!user && decoded.email) {
        user = await User.findOne({ email: decoded.email.toLowerCase() });
        console.log('User found by email:', user ? user.email : 'Not found');
      }
      
      // Method 3: If still no user, check if user might have been created with generated email
      if (!user && decoded.email) {
        // Look for user with original email OR generated email pattern
        const users = await User.find({
          $or: [
            { email: decoded.email.toLowerCase() },
            { email: { $regex: `.*@temp\.com$` } } // Find temp email users
          ]
        });
        console.log('Found users with temp emails:', users.length);
        
        // If we find temp email users, try to match by other criteria or just take the most recent one
        if (users.length > 0) {
          user = users[users.length - 1]; // Take the most recent user
          console.log('Using most recent temp user:', user.email);
        }
      }
      
    } catch (error) {
      console.error('Error finding user:', error);
    }

    if (!user) {
      console.log('No user found for token. Decoded data:', decoded);
      return NextResponse.json({ inquiries: [] });
    }

    console.log('Found user for inquiries:', user.email, 'with', user.inquiries.length, 'inquiries');

    // Populate inquiries with error handling
    let inquiries = [];
    try {
      await user.populate({
        path: 'inquiries',
        populate: {
          path: 'pg',
          model: 'PG',
          select: 'name location.address'
        }
      });

      inquiries = user.inquiries.map((inquiry: any) => ({
        id: inquiry._id,
        pgName: inquiry.pg?.name || 'Unknown PG',
        location: inquiry.pg?.location?.address || 'Unknown Location',
        inquiryDate: inquiry.createdAt,
        status: inquiry.status || 'pending',
        message: inquiry.message || ''
      }));
    } catch (error) {
      console.error('Error populating inquiries:', error);
      // Fallback: get inquiries without population
      inquiries = user.inquiries.map((inquiry: any) => ({
        id: inquiry._id || inquiry.id,
        pgName: 'Sample PG',
        location: 'Sample Location',
        inquiryDate: inquiry.createdAt || new Date(),
        status: inquiry.status || 'pending',
        message: inquiry.message || ''
      }));
    }

    return NextResponse.json({ inquiries });

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Internal server error', inquiries: [] },
      { status: 500 }
    );
  }
}

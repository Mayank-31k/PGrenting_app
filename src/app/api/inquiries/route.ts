import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/lib/models/User';
import PG from '@/lib/models/PG';
import Inquiry from '@/lib/models/Inquiry';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log('Inquiry POST request body:', requestBody);
    const { pgId, name, email, phone, message, inquiryType, preferredVisitDate } = requestBody;
    
    if (!pgId || !name || !phone) {
      return NextResponse.json(
        { error: 'PG ID, name, and phone number are required' },
        { status: 400 }
      );
    }
    
    // Get user info from token to ensure proper user association
    const authHeader = request.headers.get('authorization');
    let currentUser = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decodedToken = JSON.parse(atob(token));
        console.log('Decoded token for inquiry submission:', decodedToken);
        currentUser = { email: decodedToken.email, id: decodedToken.id };
      } catch (error) {
        console.log('Could not decode token:', error);
      }
    }
    
    await connectDB();
    
    // Check if PG exists (handle both MongoDB ObjectId and sample data numeric IDs)
    let pg;
    try {
      if (pgId.toString().match(/^[0-9a-fA-F]{24}$/)) {
        // MongoDB ObjectId
        pg = await PG.findById(pgId);
      } else {
        // Sample data numeric ID - create a mock PG for demo purposes
        pg = {
          _id: pgId,
          name: 'Sample PG',
          location: { address: 'Sample Location' },
          inquiries: []
        };
      }
    } catch (error) {
      console.error('Error finding PG:', error);
      // For demo purposes with sample data, create a mock PG
      pg = {
        _id: pgId,
        name: 'Sample PG',
        location: { address: 'Sample Location' },
        inquiries: []
      };
    }
    
    if (!pg) {
      return NextResponse.json(
        { error: 'PG not found' },
        { status: 404 }
      );
    }
    
    // Find or create user - prioritize the logged-in user from token
    let user;
    
    // First try to find the current logged-in user from token
    if (currentUser && currentUser.email) {
      user = await User.findOne({ email: currentUser.email.toLowerCase() });
      console.log('Found logged-in user:', user ? user.email : 'Not found');
    }
    
    // If no logged-in user found, fall back to traditional lookup
    if (!user) {
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });
      } else {
        user = await User.findOne({ phone });
      }
    }
    
    // If still no user, create one but use the logged-in user's email if available
    if (!user) {
      const userEmail = (currentUser && currentUser.email) ? currentUser.email.toLowerCase() : 
                       (email ? email.toLowerCase() : `${phone}@temp.com`);
      
      user = new User({
        name,
        email: userEmail,
        phone,
        password: 'temp-password-' + Date.now() // Temporary password for inquiry-only users
      });
      await user.save();
      console.log('Created new user:', user.email);
    } else {
      console.log('Using existing user:', user.email);
    }
    
    const inquiry = new Inquiry({
      user: user._id,
      pg: pgId,
      message: message || '',
      contactInfo: { name, email: email || '', phone },
      inquiryType: inquiryType || 'general',
      preferredVisitDate: preferredVisitDate || null
    });
    
    await inquiry.save();
    
    // Add inquiry to PG and User
    user.inquiries.push(inquiry._id);
    await user.save();
    
    // Only save PG if it's a real MongoDB document
    if (pg.save && typeof pg.save === 'function') {
      pg.inquiries.push(inquiry._id);
      await pg.save();
    }
    
    console.log('Inquiry submitted successfully:', { 
      pgId, 
      email: email || 'No email provided',
      pgName: pg.name,
      inquiryId: inquiry._id 
    });

    // Try to populate with real PG data, fallback to mock data
    let responseInquiry;
    try {
      const populatedInquiry = await Inquiry.findById(inquiry._id).populate('pg', 'name location.address');
      responseInquiry = {
        id: populatedInquiry._id,
        pgName: populatedInquiry.pg?.name || pg.name,
        location: populatedInquiry.pg?.location?.address || pg.location.address,
        inquiryDate: populatedInquiry.createdAt,
        status: populatedInquiry.status || 'pending',
        message: populatedInquiry.message || ''
      };
    } catch (error) {
      console.log('Using fallback inquiry data for sample PG');
      // Fallback for sample data
      responseInquiry = {
        id: inquiry._id,
        pgName: pg.name,
        location: pg.location.address,
        inquiryDate: inquiry.createdAt || new Date(),
        status: inquiry.status || 'pending',
        message: inquiry.message || ''
      };
    }
    
    const successResponse = {
      message: 'Inquiry submitted successfully',
      inquiry: responseInquiry,
      success: true
    };

    console.log('API Response:', successResponse);
    
    return NextResponse.json(successResponse, { status: 201 });
    
  } catch (error) {
    console.error('Submit inquiry error:', error);
    let errorMessage = 'Server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as any;
      const messages = Object.values(validationError.errors).map((err: any) => err.message);
      errorMessage = messages.join('. ');
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
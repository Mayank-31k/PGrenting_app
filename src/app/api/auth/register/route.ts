import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/database';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    
    const { name, email, password, confirmPassword } = await request.json();
    
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 }
      );
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    });
    
    await user.save();
    
    const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-change-in-production';
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('User registered:', email);
    
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      const validationError = error as any;
      const messages = Object.values(validationError.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join('. ') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
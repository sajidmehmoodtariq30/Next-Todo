import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/utils/auth';
import { validateEmail, validatePassword } from '@/utils/helpers';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    
    // Debug logging
    console.log('User found:', !!user);
    console.log('User has password field:', !!user?.password);
    console.log('Password field value:', user?.password ? 'exists' : 'missing');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id);

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          bio: user.bio
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

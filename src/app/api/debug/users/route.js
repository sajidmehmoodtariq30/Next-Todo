import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const users = await User.find({});
    console.log('All users in database:', users.length);
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0
      });
    });

    return NextResponse.json({
      message: 'Users fetched',
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: !!user.password
      }))
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

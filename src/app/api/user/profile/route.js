import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/utils/auth';
import cloudinary from '@/lib/cloudinary';

export async function PUT(request) {
  try {
    await dbConnect();
    
    // Get token from cookie or Authorization header
    const token = request.cookies.get('token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    
    const formData = await request.formData();
    const name = formData.get('name');
    const bio = formData.get('bio');
    const profileImage = formData.get('profileImage');

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {};
    
    if (name) updateData.name = name.trim();
    if (bio !== null) updateData.bio = bio.trim();

    // Handle profile image upload
    if (profileImage && profileImage.size > 0) {
      try {
        // Convert file to base64
        const bytes = await profileImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${profileImage.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(base64Image, {
          folder: 'todo-app/profiles',
          public_id: `user_${decoded.userId}`,
          overwrite: true,
          transformation: [
            { width: 300, height: 300, crop: 'fill' },
            { quality: 'auto' }
          ]
        });

        updateData.profileImage = uploadResult.secure_url;

        // Delete old image if it exists and is from Cloudinary
        if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
          const publicId = user.profileImage.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: messages[0] },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

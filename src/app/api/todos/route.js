import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { verifyToken } from '@/utils/auth';

export async function GET(request) {
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
    
    // Get query parameters
    const url = new URL(request.url);
    const completed = url.searchParams.get('completed');
    const priority = url.searchParams.get('priority');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;

    // Build filter
    const filter = { userId: decoded.userId };
    
    if (completed !== null) {
      filter.completed = completed === 'true';
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (category) {
      filter.category = category;
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get todos with pagination
    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalTodos = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(totalTodos / limit);

    return NextResponse.json({
      todos,
      pagination: {
        currentPage: page,
        totalPages,
        totalTodos,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    
    if (error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    
    const { title, description, priority, dueDate, category } = await request.json();

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create todo
    const todo = await Todo.create({
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      category: category?.trim() || 'general',
      userId: decoded.userId
    });

    return NextResponse.json(
      {
        message: 'Todo created successfully',
        todo
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create todo error:', error);
    
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

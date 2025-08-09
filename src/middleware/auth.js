import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

export function authMiddleware(handler) {
  return async (request, context) => {
    try {
      const token = request.cookies.get('token')?.value || 
                   request.headers.get('authorization')?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      
      // Add user info to request
      const modifiedRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      
      // Add user to context
      const newContext = {
        ...context,
        user: { userId: decoded.userId }
      };

      return handler(modifiedRequest, newContext);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
  };
}

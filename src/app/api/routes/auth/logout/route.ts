// app/api/auth/logout/route.ts
import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REFRESH_TOKEN,
} from '@/constants/api-resources';
import axios from 'axios';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. Call backend logout endpoint with axios
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {withCredentials: true},
    );
    console.error(response, 'Logout res');

    // 2. Clear cookies on Next.js side
    const res = NextResponse.json({success: true, message: 'Logged out'});

    res.cookies.set(ACCESS_TOKEN as string, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(0), // expire immediately
    });

    res.cookies.set(REFRESH_TOKEN as string, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(0),
    });

    return res;
  } catch (err: any) {
    console.error(
      'Logout error:',
      err.response?.data || err.message || err.toString(),
    );
    return NextResponse.json(
      {success: false, message: 'Logout failed'},
      {status: 500},
    );
  }
}

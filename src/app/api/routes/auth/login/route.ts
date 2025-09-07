// app/api/auth/login/route.ts
import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REFRESH_TOKEN,
} from '@/constants/api-resources';
import axios from 'axios';
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, body, {
      withCredentials: true, // forward cookies if backend sends any
    });

    // Backend JSON response
    const data = response.data;
    const {accessToken, refreshToken} = data;
    console.log(data, 'restooo22data');
    const res = NextResponse.json(data);
    console.log(res, 'restooo22');
    const cookie = await cookies();
    // Set cookies for access & refresh tokens
    cookie.set(ACCESS_TOKEN as string, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 600, // 2 minutes
      path: '/',
    });

    cookie.set(REFRESH_TOKEN as string, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 900, // 3 minutes (example)
      path: '/',
    });

    return res;
  } catch (err: any) {
    console.error('Login failed:', err.response?.data || err.message);
    return NextResponse.json(
      {error: 'Login failed', details: err.response?.data},
      {status: err.response?.status || 500},
    );
  }
}

// app/api/auth/refresh/route.ts
import {API_BASE_URL} from '@/constants/api-resources';
import axios from 'axios';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {},
      {
        withCredentials: true, // send cookies
      },
    );

    const data = response.data;

    // Axios gives headers as an object
    const setCookie = response.headers['set-cookie'];
    console.log(setCookie, 'destoooooRefresh');

    const res = NextResponse.json(data);

    if (setCookie) {
      // ✅ Forward each cookie individually
      (Array.isArray(setCookie) ? setCookie : [setCookie]).forEach(cookie => {
        res.headers.append('Set-Cookie', cookie);
      });
    }

    return res;
  } catch (err: any) {
    console.error('Refresh route error:', err.response?.data || err.message);
    return NextResponse.json(
      {message: 'Refresh failed', details: err.response?.data},
      {status: err.response?.status || 401},
    );
  }
}

// app/api/auth/login/route.ts
import {API_BASE_URL} from '@/constants/api-resources';
import axios from 'axios';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, body, {
      withCredentials: true, // forward cookies
    });

    // axios parses JSON automatically
    const data = response.data;

    // Get cookies from backend response
    const cookies = response.headers['set-cookie'];
    console.log(cookies, 'cookies from backend');

    // Forward response + cookies to client
    const res = NextResponse.json(data);

    // if (cookies) {
    //   // ✅ Forward each cookie individually
    //   (Array.isArray(cookies) ? cookies : [cookies]).forEach(cookie => {
    //     console.log(cookie, 'my cookieeee');
    //     res.headers.append('Set-Cookie', cookie);
    //   });
    // }

    (Array.isArray(cookies) ? cookies : [cookies]).forEach((cookie: any) => {
      const [cookiePair, ...attributes] = cookie.split(';');
      const [name, value] = cookiePair.split('=');

      res.cookies.set(name.trim(), value, {
        path: '/',
        httpOnly: attributes.includes('HttpOnly'),
        secure: attributes.includes('Secure'),
        sameSite: attributes
          .find((attr: any) => attr.includes('SameSite'))
          ?.split('=')[1] as any,
        maxAge: Number(
          attributes
            .find((attr: any) => attr.includes('Max-Age'))
            ?.split('=')[1],
        ),
      });
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

// app/api/auth/login/route.ts
import {API_BASE_URL} from '@/constants/api-resources';
import axios from 'axios';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, body, {
      withCredentials: true, // forward cookies from backend
    });

    // Axios automatically parses JSON
    const data = response.data;

    // Get Set-Cookie headers from backend
    const cookies = response.headers['set-cookie'];
    console.log(cookies, 'cookies from backend');

    const res = NextResponse.json(data);

    // if (cookies) {
    //   const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

    //   cookieArray.forEach(cookieStr => {
    //     console.log(cookieStr, 'raw cookie');

    //     // Split cookie string into name=value and attributes
    //     const [cookiePair, ...attributes] = cookieStr.split(';');
    //     const [name, value] = cookiePair.split('=');
    //     console.log(name, 'raw cookie22', value);

    //     // Parse attributes
    //     const httpOnly = attributes.some(attr =>
    //       attr.toLowerCase().includes('httponly'),
    //     );
    //     const secure = attributes.some(attr =>
    //       attr.toLowerCase().includes('secure'),
    //     );
    //     const sameSiteAttr = attributes.find(attr =>
    //       attr.toLowerCase().includes('samesite'),
    //     );
    //     const sameSite = sameSiteAttr
    //       ? (sameSiteAttr.split('=')[1] as 'lax' | 'strict' | 'none')
    //       : 'lax';
    //     const maxAgeAttr = attributes.find(attr =>
    //       attr.toLowerCase().includes('max-age'),
    //     );
    //     const maxAge = maxAgeAttr
    //       ? Number(maxAgeAttr.split('=')[1])
    //       : undefined;

    //     // Set cookie in Next.js response
    //     res.cookies.set(name.trim(), value, {
    //       httpOnly,
    //       secure,
    //       sameSite,
    //       maxAge,
    //       path: '/',
    //     });
    //   });
    // }

    return res;
  } catch (err: any) {
    console.error('Login failed:', err.response?.data || err.message);
    return NextResponse.json(
      {error: 'Login failed', details: err.response?.data},
      {status: err.response?.status || 500},
    );
  }
}

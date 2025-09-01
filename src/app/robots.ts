// app/robots.ts
import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: [
        '/advertise/ad-performance',
        '/settings',
        '/api',
        '/auth',
        '/admin',
        '/notifications',
      ],
      allow: ['/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}

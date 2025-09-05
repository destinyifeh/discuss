// import {Sections} from '@/constants/data';
// import type {MetadataRoute} from 'next';
// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const posts = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/sitemap-posts`,
//   ).then(res => res.json());
//   console.log(posts, 'sitemapPost');
//   console.log(Sections, 'sitemapSection');
//   return [
//     // Static pages
//     {
//       url: process.env.NEXT_PUBLIC_APP_URL,
//       lastModified: new Date(),
//       changeFrequency: 'yearly',
//       priority: 1,
//     },
//     {
//       url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },
//     {
//       url: `${process.env.NEXT_PUBLIC_APP_URL}/help-center`,
//       lastModified: new Date(),
//       changeFrequency: 'monthly',
//       priority: 0.8,
//     },

//     // Dynamic sections
//     ...Sections.map((section: {name: string}) => ({
//       url: `${
//         process.env.NEXT_PUBLIC_APP_URL
//       }/discuss/${section.name.toLowerCase()}`,
//       lastModified: new Date(),
//       changeFrequency: 'weekly',
//       priority: 0.7,
//     })),

//     // Individual posts
//     ...posts.map(
//       (post: {
//         slug: string;
//         section: string;
//         slugId: string;
//         updatedAt?: string;
//       }) => ({
//         url: `${
//           process.env.NEXT_PUBLIC_APP_URL
//         }/discuss/${post.section.toLowerCase()}/${post.slugId}/${post.slug}`,
//         lastModified: new Date(post.updatedAt || Date.now()),
//         changeFrequency: 'daily',
//         priority: 0.6,
//       }),
//     ),
//   ];
// }

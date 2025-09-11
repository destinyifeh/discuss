import {API_BASE_URL} from '@/constants/api-resources';
import {APP_NAME} from '@/constants/settings';
import {capitalizeName} from '@/lib/formatter';
import {PostDetailPage} from '@/modules/posts/post-detail';
import {Metadata} from 'next';

type PageParams = {
  section: string;
  slugId: string;
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const {section, slugId, slug} = await params;

  const res = await fetch(`${API_BASE_URL}/posts/post-details/${slugId}`, {
    next: {revalidate: 60},
  });

  if (!res.ok) {
    return {
      title: 'Post not found',
      description: 'This post does not exist',
    };
  }

  const post = await res.json();

  const previewText = post.content?.slice(0, 120) ?? 'Check out this post';
  const firstImage =
    post.images?.[0]?.secure_url ??
    `${process.env.NEXT_PUBLIC_APP_URL}/wizzy.jpeg`;

  return {
    title: `${post.title} | ${capitalizeName(post.section)} | ${APP_NAME}`,
    description: previewText,
    openGraph: {
      description: `Join the discussion on ${APP_NAME} — read and share thoughts on "${post.title}".`,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${section}/${slugId}/${slug}`,
      siteName: APP_NAME,
      images: [
        {
          url: firstImage,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: previewText,
      images: [firstImage],
    },
  };
}

export default async function Page({params}: {params: any}) {
  const {slug, slugId, section} = await params;

  return <PostDetailPage params={{slug, slugId, section}} />;
}

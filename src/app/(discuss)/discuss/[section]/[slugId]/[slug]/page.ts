import {APP_NAME} from '@/constants/settings';
import {PostDetailPage} from '@/modules/posts/post-detail';

type Props = {
  params: {section: string; slugId: string; slug: string};
};

export async function generateMetadata({params}: Props) {
  const {section, slugId, slug} = params;

  // if you need to fetch post data:
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/details/${slugId}`,
    {
      next: {revalidate: 60}, // optional
    },
  );

  if (!res.ok) {
    return {
      title: 'Post not found',
      description: 'This post does not exist',
    };
  }

  const post = await res.json();

  return {
    title: `${post.title} | ${APP_NAME}`,
    description: post.content?.slice(0, 120) ?? 'Check out this post',
    openGraph: {
      title: post.title,
      description: post.content?.slice(0, 120),
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${section}/${slugId}/${slug}`,
      siteName: APP_NAME,
      images: [
        {
          url:
            post.images[0]?.secure_url ??
            `${process.env.NEXT_PUBLIC_APP_URL}/assets/default.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content?.slice(0, 120),
      images: [
        post.images[0]?.secure_url ??
          `${process.env.NEXT_PUBLIC_APP_URL}/assets/default.jpg`,
      ],
    },
  };
}

export default PostDetailPage;

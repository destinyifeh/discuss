import {API_BASE_URL} from '@/constants/api-resources';
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
  const {section, slugId, slug} = params;

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

  console.log(post, 'postakkkk');

  const previewText = post.content?.slice(0, 120) ?? 'Check out this post';
  const firstImage =
    post.images?.[0]?.secure_url ??
    `https://discuss-mu-three.vercel.app/wizzy.jpeg`;

  return {
    // title: `${post.title}`,
    // description: previewText,
    openGraph: {
      title: post.title,
      description: previewText,
      url: `https://discuss-mu-three.vercel.app/${section}/${slugId}/${slug}`,
      //siteName: APP_NAME,
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

export default PostDetailPage;

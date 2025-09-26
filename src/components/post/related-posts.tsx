'use client';

import {postService} from '@/modules/posts/actions';
import {useQuery} from '@tanstack/react-query';
import ErrorFeedback from '../feedbacks/error-feedback';
import PostSkeleton from '../skeleton/post-skeleton';
import PostCard from './post-card';

export const RelatedPosts = ({postId}: {postId: string}) => {
  const shouldQuery = !!postId;
  const {
    isLoading,
    error,
    data: posts,
    status: postStatus,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['related-posts', postId],
    queryFn: () => postService.getRelatedPostRequestAction(postId),
    retry: 1,
    enabled: shouldQuery,
  });

  console.log(posts, 'related dataa');

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (postStatus === 'error') {
    return (
      <ErrorFeedback
        showRetry
        onRetry={refetchPost}
        message="Failed to load related posts"
        variant="minimal"
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts && posts.length > 0 ? (
        posts.map((post: any) => <PostCard key={post._id} post={post} />)
      ) : (
        <p className="text-sm text-gray-500">No related posts found.</p>
      )}
    </div>
  );
};

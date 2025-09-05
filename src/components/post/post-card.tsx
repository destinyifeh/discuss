'use client';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn} from '@/lib/utils';
import {PostFeedProps, PostStatus} from '@/types/post-item.type';
import copy from 'copy-to-clipboard';
import {formatDistanceToNow} from 'date-fns';
import {
  BarChart3,
  Bookmark,
  EllipsisVertical,
  Heart,
  LinkIcon,
  MessageSquare,
  MoreHorizontal,
  Share2,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';

import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {queryClient} from '@/lib/client/query-client';
import {useReportActions} from '@/modules/dashboard/actions/action-hooks/report.action-hooks';
import {userService} from '@/modules/dashboard/actions/user.actions';
import {postService} from '@/modules/posts/actions';
import {usePostActions} from '@/modules/posts/post-hooks';
import {UserProps} from '@/types/user.types';
import {useMutation, useQuery} from '@tanstack/react-query';
import ErrorFeedback from '../feedbacks/error-feedback';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import {Button} from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover';
import {toast} from '../ui/toast';
import {PostContent} from './post-content';

interface PostCardProps {
  post: PostFeedProps;
  showActions?: boolean;
  isInDetailView?: boolean;
  hideMenu?: boolean;
}

const PostCard = ({
  post,
  showActions = true,
  isInDetailView = false,
  hideMenu = false,
}: PostCardProps) => {
  const {theme} = useGlobalStore(state => state);
  const {currentUser, setUser} = useAuthStore(state => state);
  const [isPending, setIsPending] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(
    post?.likedBy.length || 0,
  );
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const [liked, setLiked] = useState(
    currentUser ? (post?.likedBy || []).includes(currentUser._id) : false,
  );
  const {likePostRequest, bookmarkPostRequest} = usePostActions();

  const {mutate} = useMutation({
    mutationFn: userService.followUserRequestAction,
  });

  const {reportPost} = useReportActions();

  const shouldQuery = !!post?._id;
  const {error, data: commentData} = useQuery({
    queryKey: ['post-comments-count', post?._id],
    queryFn: () => postService.getPostCommentsCountRequestAction(post?._id),
    retry: 1,
    enabled: shouldQuery,
  });

  const navigate = useRouter();
  const handleLike = () => {
    likePostRequest.mutate(post._id, {
      onSuccess(data, variables, context) {
        console.log(data, 'post like');
        // setLikesCount(data.likesCount);
        queryClient.invalidateQueries({queryKey: ['home-feed-posts']});
        queryClient.invalidateQueries({queryKey: ['bookmarked-feed-posts']});
        queryClient.invalidateQueries({
          queryKey: ['section-feed-posts'],
        });
        queryClient.invalidateQueries({
          queryKey: ['explore-feed-posts'],
        });
        queryClient.invalidateQueries({
          queryKey: ['post-details'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-profile-posts', 'posts'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-profile-posts', 'likes'],
        });
        queryClient.invalidateQueries({
          queryKey: ['public-user-posts', 'replies'],
        });
        queryClient.invalidateQueries({
          queryKey: ['public-user-posts', 'posts'],
        });
      },
      onError(error: any, variables, context) {
        console.log(error, 'error');
        toast.error(
          error?.response?.data?.message ??
            'Oops! Something went wrong, try again',
        );
      },
    });
  };

  const handleBookmark = () => {
    bookmarkPostRequest.mutate(post._id, {
      onSuccess(data, variables, context) {
        console.log(data, 'post like');
        queryClient.invalidateQueries({queryKey: ['home-feed-posts']});
        queryClient.invalidateQueries({queryKey: ['bookmarked-feed-posts']});
        queryClient.invalidateQueries({
          queryKey: ['section-feed-posts'],
        });
        queryClient.invalidateQueries({
          queryKey: ['explore-feed-posts'],
        });

        queryClient.invalidateQueries({
          queryKey: ['post-details'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-profile-posts', 'posts'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-profile-posts', 'likes'],
        });

        queryClient.invalidateQueries({
          queryKey: ['public-user-posts', 'likes'],
        });
        queryClient.invalidateQueries({
          queryKey: ['public-user-posts', 'posts'],
        });

        if (data.bookmarked === true) {
          toast.success('Post bookmarked');
        }
        if (data.bookmarked === false) {
          toast.success('Bookmark removed');
        }
      },
      onError(error: any, variables, context) {
        console.log(error, 'err');
        toast.error(
          error?.response?.data?.message ??
            'Oops! Something went wrong, try again',
        );
      },
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTimeAgo2 = (date: any): string => {
    const newDate = moment(date).fromNow();
    return newDate;
  };

  const formatTimeAgo = (date: Date | string): string => {
    const distance = formatDistanceToNow(new Date(date), {addSuffix: false});

    return distance
      .replace(/about\s/, '')
      .replace(/less than a minute/, '< 1m')
      .replace(/minute/, 'm')
      .replace(/hour/, 'h')
      .replace(/day/, 'd')
      .replace(/month/, 'mo')
      .replace(/year/, 'y')
      .replace(/\s/g, '');
  };

  const handleReport = (postId: string) => {
    const payload = {
      reason: 'No reason provided. Requires admin review.',
      postId: postId,
    };

    reportPost.mutate(payload, {
      onSuccess(data, variables, context) {
        console.log(data, 'report data');
        toast.success('Post Reported', {
          description:
            'Thank you for reporting this post. Our team will review it.',
        });
      },
      onError(error, variables, context) {
        console.log(error, 'post report err');

        toast.error('Report Failed', {
          description:
            'Sorry, we were unable to submit your report. Please try again.',
        });
      },
    });
  };

  const handleFollow = () => {
    if (!currentUser || post.user._id === currentUser._id) return;

    setIsPending(true);
    mutate(post.user._id, {
      onSuccess(response, variables, context) {
        console.log(response, 'datameee');

        const {
          currentUserFollowers,
          currentUserFollowings,
          message,
          isFollowing,
          following,
          followers,
        } = response.data;

        setUser({
          ...(currentUser as UserProps),
          following: currentUserFollowings,
        });

        queryClient.invalidateQueries({
          queryKey: ['home-feed-posts', 'following'],
        });

        toast.success(message);
      },

      onError(error, variables, context) {
        console.log(error, 'err');
        toast.error('Oops! Something went wrong, please try again.');
      },
      onSettled(data, error, variables, context) {
        setIsPending(false);
      },
    });
  };

  const handleEditPost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigate.push(
      `/discuss/${post.section.toLowerCase()}/${post.slugId}/${post.slug}/edit`,
    );
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(
      `/discuss/${post.section.toLowerCase()}/${post.slugId}/${post.slug}`,
    );
  };

  const navigateToUserProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/user/${post.user.username}`);
  };

  const shouldTruncate = post?.content.length > 100;
  const displayContent =
    shouldTruncate && !expanded && !isInDetailView
      ? post?.content.slice(0, 100) + '...'
      : post?.content;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/discuss/${post.section}/${post.slugId}/${post.slug}`;
    try {
      copy(postUrl);
      toast.success('Link Copied', {
        description: 'Post link has been copied to clipboard.',
      });
      setTimeout(() => setSharePopoverOpen(false), 500);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      toast.error('Copy Failed', {
        description: 'Failed to copy link, please try again.',
      });
    }
  };

  const isLiked = post?.likedBy.includes(currentUser?._id as string);

  console.log(post, 'the postss');

  if (!post || post === null) {
    return <ErrorFeedback showGoBack message="Post not found" />;
  }

  const isFollowing = currentUser?.following?.includes(
    post.user._id?.toString(),
  );

  return (
    <div className="border-b py-4 px-2 transition-colors hover:bg-app-hover border-app-border dark:hover:bg-background ">
      <div className="flex gap-3">
        <Avatar
          className="w-10 h-10 cursor-pointer"
          onClick={navigateToUserProfile}>
          <AvatarImage src={post.user.avatar ?? undefined} />
          <AvatarFallback className="capitalize text-app text-3xl">
            {post.user.username.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 overflow-hidden">
                <div className="font-bold hover:underline truncate cursor-pointer">
                  <Link
                    href={`/user/${post.user.username}`}
                    className="capitalize">
                    {post.user.username}
                  </Link>
                </div>

                <span className="text-app-gray">·</span>

                <Link
                  href={`/discuss/${post.section.toLowerCase()}`}
                  className="text-app hover:underline truncate"
                  onClick={e => e.stopPropagation()}>
                  {post.section.toLowerCase()}
                </Link>

                <span className="text-app-gray">·</span>
                <span className="text-app-gray truncate">
                  {formatTimeAgo(post.createdAt)}
                </span>
              </div>
              {!hideMenu && (
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => setIsMenuOpen(prev => !prev)}>
                      <MoreHorizontal size={16} className="hidden md:block" />
                      <EllipsisVertical size={16} className="md:hidden" />
                      <span className="sr-only">Post menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border-app-border">
                    {post.user._id === currentUser?._id &&
                      post.status !== (PostStatus.PROMOTED as string) && (
                        <>
                          <DropdownMenuItem
                            onClick={handleEditPost}
                            className="cursor-pointer justify-center">
                            {/* <Pencil size={16} className="mr-2 font-bold" /> */}
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}

                    {post.user._id !== currentUser?._id && (
                      <>
                        <DropdownMenuItem
                          onClick={handleFollow}
                          className="cursor-pointer">
                          {isFollowing ? (
                            <>
                              <UserCheck size={16} className="mr-2" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} className="mr-2" />
                              Follow
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleReport(post._id)}
                      className="cursor-pointer justify-center">
                      Report
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsMenuOpen(false)}
                      className="cursor-pointer text-app justify-center">
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <Link
            href={`/discuss/${post.section.toLowerCase()}/${post.slugId}/${
              post.slug
            }`}
            className="block">
            <div className="mt-1">
              {/* <p className="whitespace-pre-wrap">{displayContent}</p> */}
              <PostContent content={displayContent} />

              {shouldTruncate && !isInDetailView && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate.push(
                      `/discuss/${post.section.toLowerCase()}/${post.slug}`,
                    );
                  }}>
                  See more
                </Button>
              )}

              {!isInDetailView && post.images && post.images.length > 0 && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  <img
                    src={post.images[0].secure_url}
                    alt="Post attachment"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}

              {isInDetailView && post.images && post.images?.length > 0 && (
                <div className="mt-3 rounded-xl overflow-hidden space-y-3">
                  {post.images.map((img, idx) => (
                    <img
                      key={img.public_id || idx}
                      src={img.secure_url}
                      alt={`Post attachment ${idx + 1}`}
                      className="w-full h-auto max-h-96 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex justify-between mt-3 max-w-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={handleCommentClick}>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={18} />
                    <span className="text-xs">
                      {commentData?.commentCount || 0}
                    </span>
                  </div>
                </Button>

                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <div className="flex items-center gap-1">
                    <Repeat2 size={18} />
                    <span className="text-xs">
                      {formatNumber(post.reposts)}
                    </span>
                  </div>
                </Button> */}

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'text-app-gray hover:text-red-500',
                    isLiked && 'text-red-500',
                  )}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLike();
                  }}>
                  <div className="flex items-center gap-1">
                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="text-xs">{post.likedBy.length || 0}</span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <div className="flex items-center gap-1">
                    <BarChart3 size={18} />
                    <span className="text-xs">{post.viewCount || 0}</span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBookmark();
                  }}>
                  <div className="flex items-center gap-1">
                    <Bookmark
                      size={18}
                      fill={
                        post.bookmarkedBy.includes(currentUser?._id as string)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                    <span className="text-xs">
                      {post.bookmarkedBy.length || 0}
                    </span>
                  </div>
                </Button>

                <Popover
                  open={sharePopoverOpen}
                  onOpenChange={setSharePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-app-gray hover:text-app"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSharePopoverOpen(!sharePopoverOpen);
                      }}>
                      <Share2 size={18} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        onClick={handleCopyLink}>
                        <LinkIcon size={16} className="mr-2" />
                        Copy link
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PostCard);

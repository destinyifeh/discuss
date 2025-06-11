'use client';
import {Sections} from '@/constants/data';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn} from '@/lib/utils';
import {PostProps} from '@/types/post-item.type';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import {formatDistanceToNow} from 'date-fns';
import {
  BarChart3,
  Bookmark,
  EllipsisVertical,
  Flag,
  Heart,
  LinkIcon,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Share2,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';

import {toast} from 'sonner';
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
import {PostContent} from './post-content';

interface PostCardProps {
  post: PostProps;
  showActions?: boolean;
  isInDetailView?: boolean;
}

const PostCard = ({
  post,
  showActions = true,
  isInDetailView = false,
}: PostCardProps) => {
  const {theme} = useGlobalStore(state => state);
  const [user] = useState({id: '2', following: ['2']});
  const [expanded, setExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const [liked, setLiked] = useState(
    user ? (post?.likedBy || []).includes(user.id) : false,
  );
  const [isFollowing, setIsFollowing] = useState(
    user ? (user.following || []).includes(post.userId) : false,
  );
  const navigate = useRouter();
  const handleLike = () => {
    if (!user) return;

    setLiked(!liked);
    // likePost(post.id, user.id);
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

  const handleReport = () => {
    toast.success('Post Reported', {
      description:
        'Thank you for reporting this post. Our team will review it.',
    });
  };

  const handleFollow = () => {
    if (!user || post.userId === user.id) return;

    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed' : 'Following', {
      description: isFollowing
        ? `You unfollowed ${post.displayName}`
        : `You're now following ${post.displayName}`,
    });
  };

  const handleEditPost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigate.push(`/create-post?postId=${post.id}`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/post/${post.id}`);
  };

  const navigateToUserProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/profile/${post.username}`);
  };

  const section = post.sectionId
    ? Sections.find(cat => cat.id === post.sectionId)
    : null;

  const shouldTruncate = post.content.length > 100;
  const displayContent =
    shouldTruncate && !expanded && !isInDetailView
      ? post.content.slice(0, 100) + '...'
      : post.content;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/post/${post.id}`;
    try {
      copy(postUrl);
      toast('Link Copied', {
        description: 'Post link has been copied to clipboard.',
      });
      setTimeout(() => setSharePopoverOpen(false), 500);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      toast('Copy Failed', {
        description: 'Failed to copy link, please try again.',
      });
    }
  };

  return (
    <div
      className={clsx('border-b py-4 px-2 transition-colors', {
        'hover:bg-app-hover border-app-border': theme.type === 'default',
        'border-app-dark-border text-app-dark-text': theme.type === 'dark',
      })}>
      <div className="flex gap-3">
        <Avatar
          className="w-10 h-10 cursor-pointer"
          onClick={navigateToUserProfile}>
          <AvatarImage src={post.avatar} />
          <AvatarFallback>{post.displayName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 overflow-hidden">
                <div className="font-bold hover:underline truncate cursor-pointer">
                  <Link href={`/user/${post.username}`} className="">
                    {post.displayName}
                  </Link>
                </div>

                <span className="text-app-gray">·</span>

                {section && (
                  <Link
                    href={`/discuss/${section.name.toLowerCase()}`}
                    className="text-app hover:underline truncate"
                    onClick={e => e.stopPropagation()}>
                    {section.name}
                  </Link>
                )}

                <span className="text-app-gray">·</span>
                <span className="text-app-gray truncate">
                  {formatTimeAgo(post.timestamp)}
                </span>
              </div>

              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger
                  asChild
                  className={clsx({
                    'hover:bg-app-dark-bg/10 hover:text-white':
                      theme.type === 'dark',
                  })}>
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
                  className={clsx({
                    'bg-app-dark-bg/10 border-app-dark-border text-white':
                      theme.type === 'dark',
                  })}>
                  {post.userId === user?.id && (
                    <>
                      <DropdownMenuItem
                        onClick={handleEditPost}
                        className="cursor-pointer text-black font-bold">
                        <Pencil
                          size={16}
                          className="mr-2 text-black font-bold"
                        />
                        Edit post
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {post.userId !== user?.id && (
                    <>
                      <DropdownMenuItem
                        onClick={handleFollow}
                        className="cursor-pointer text-black font-bold">
                        {isFollowing ? (
                          <>
                            <UserCheck size={16} className="mr-2 text-black" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} className="mr-2 text-black" />
                            Follow
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleReport}
                    className="cursor-pointer text-black font-bold">
                    <Flag size={16} className="mr-2 text-black font-bold" />
                    Report post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsMenuOpen(false)}
                    className="cursor-pointer text-app font-bold justify-center">
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Link href={`/post/${post.id}`} className="block">
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
                    navigate.push(`/post/${post.id}`);
                  }}>
                  See more
                </Button>
              )}

              {post.images && post.images.length > 0 && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  <img
                    src={post.images[0]}
                    alt="Post attachment"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex justify-between mt-3 max-w-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={clsx('text-app-gray hover:text-app', {
                    'hover:bg-app-dark-bg/10': theme.type === 'dark',
                  })}
                  onClick={handleCommentClick}>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={18} />
                    <span className="text-xs">
                      {formatNumber(post.comments || 0)}
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
                    liked && 'text-red-500',
                    theme.type === 'dark' && 'hover:bg-app-dark-bg/10',
                  )}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLike();
                  }}>
                  <div className="flex items-center gap-1">
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-xs">{formatNumber(post.likes)}</span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={clsx('text-app-gray hover:text-app', {
                    'hover:bg-app-dark-bg/10': theme.type === 'dark',
                  })}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <div className="flex items-center gap-1">
                    <BarChart3 size={18} />
                    <span className="text-xs">
                      {formatNumber(post.views || 0)}
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={clsx('text-app-gray hover:text-app', {
                    'hover:bg-app-dark-bg/10': theme.type === 'dark',
                  })}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <Bookmark size={18} />
                </Button>

                <Popover
                  open={sharePopoverOpen}
                  onOpenChange={setSharePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={clsx('text-app-gray hover:text-app', {
                        'hover:bg-app-dark-bg/10': theme.type === 'dark',
                      })}
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
                        className="justify-start text-black"
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

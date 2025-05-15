'use client';
import {mockAds} from '@/constants/data';
import {cn} from '@/lib/utils';
import {AdProps} from '@/types/ad-types';
import copy from 'copy-to-clipboard';
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
} from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Fragment, useState} from 'react';
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

interface AdCardProps {
  ad?: AdProps;
  showActions?: boolean;
  isInDetailView?: boolean;
}

export const AdCard = ({
  ad,
  showActions = true,
  isInDetailView = false,
}: AdCardProps) => {
  const [user] = useState({id: '2', following: ['2']});
  const [expanded, setExpanded] = useState(false);
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);

  const navigate = useRouter();
  const handleLike = () => {
    // if (!user) return;
    // setLiked(!liked);
    // likePost(post.id, user.id);
  };
  const liked = true;

  const formatNumber = (num: number) => {
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

  const handleReport = () => {
    toast.success('Post Reported', {
      description:
        'Thank you for reporting this post. Our team will review it.',
    });
  };

  const handleEditPost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigate.push(`/create-post?postId`);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/post/`);
  };

  const navigateToUserProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/profile/`);
  };

  //   const displayContent =
  //     shouldTruncate && !expanded && !isInDetailView
  //       ? post.content.slice(0, 100) + '...'
  //       : post.content;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = `${window.location.origin}/post/${ad?.id}`;
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

  const shouldTruncate = ad && ad.content && ad.content.length > 100;
  const sliceContent = ad && ad.content && ad.content.slice(0, 100) + '...';
  //const shouldTruncate = ad && ad.content

  const displayContent =
    shouldTruncate && !expanded && !isInDetailView ? sliceContent : ad?.content;

  return (
    <div className="border-b border-app-border p-4 hover:bg-app-hover transition-colors">
      <div className="flex gap-3">
        <Avatar
          className="w-10 h-10 cursor-pointer"
          onClick={navigateToUserProfile}>
          <AvatarImage src={ad?.author.avatar} />
          <AvatarFallback>D</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 overflow-hidden">
                <div className="font-bold hover:underline truncate cursor-pointer">
                  <Link href={`/user/dee`} className="">
                    {ad?.author.name}
                  </Link>
                </div>

                <span className="text-app-gray">·</span>

                <Link
                  href={`#`}
                  className="text-black hover:underline truncate"
                  onClick={e => e.stopPropagation()}>
                  {ad?.type}
                </Link>

                {/* <span className="text-app-gray">·</span>
                <span className="text-app-gray truncate">
                  {formatTimeAgo(post.timestamp)}
                </span> */}
              </div>
              {!isInDetailView && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      <MoreHorizontal size={16} className="hidden md:block" />
                      <EllipsisVertical size={16} className="md:hidden" />
                      <span className="sr-only">Ad menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleEditPost}
                      className="cursor-pointer">
                      <Pencil size={16} className="mr-2" />
                      Edit post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleReport}
                      className="cursor-pointer text">
                      <Flag size={16} className="mr-2" />
                      Report post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="block">
            <div className="mt-1">
              <p className="whitespace-pre-wrap text-black">{displayContent}</p>

              {shouldTruncate && !isInDetailView && !expanded && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    //navigate.push(`/post/${ad.id}`);
                    setExpanded(true);
                  }}>
                  See more
                </Button>
              )}

              {expanded && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-app"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    //navigate.push(`/post/${ad.id}`);
                    setExpanded(false);
                  }}>
                  See less
                </Button>
              )}

              {ad?.imageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  <img
                    src={ad.imageUrl}
                    alt="Ad attachment"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}
            </div>

            {!showActions && (
              <div className="flex justify-between mt-3 max-w-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app-gray hover:text-app"
                  onClick={handleCommentClick}>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={18} />
                    <span className="text-xs">
                      {/* {formatNumber(ad?.adComments || 0)} */}
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
                  )}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLike();
                  }}>
                  <div className="flex items-center gap-1">
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-xs">
                      {/* {formatNumber(ad?.adLikes ?? 0)} */}
                    </span>
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
                    <span className="text-xs">
                      {/* {formatNumber(ad?.adViews || 0)} */}
                    </span>
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
                  <Bookmark size={18} />
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
            <div className="flex justify-between items-center mt-3">
              <h1 className="font-bold text-black">{ad?.title}</h1>
              <Button
                variant="ghost"
                size="sm"
                // className="rounded-full border text-white hover:bg-app/90 "
                className="rounded-full border border-[1.4px] border-app text-app font-bold hover:border-app/90 hover:text-app/90 text-sm "
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
                {ad?.callToAction}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AppSponsoredAd({category}: {category: string}) {
  const sponsoredAds = mockAds.filter(
    ad => ad.type === 'Sponsored' && ad.category === category,
  );
  if (sponsoredAds.length === 0) return null;
  return (
    <Fragment>
      {sponsoredAds.map(ad => (
        <div key={ad.id}>
          <AdCard ad={ad} />
        </div>
      ))}
    </Fragment>
  );
}

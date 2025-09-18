'use client';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useGlobalStore} from '@/hooks/stores/use-global-store';
import {cn} from '@/lib/utils';
import {CommentFeedProps} from '@/types/post-item.type';
import React, {useState} from 'react';

import {formatTimeAgo2} from '@/lib/formatter';
import {
  EllipsisVertical,
  Heart,
  MessageSquare,
  MoreHorizontal,
  ThumbsDown,
} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {queryClient} from '@/lib/client/query-client';
import {useReportActions} from '@/modules/dashboard/actions/action-hooks/report.action-hooks';
import {usePostActions} from '@/modules/posts/post-hooks';
import {toast} from '../ui/toast';
import {PostContent} from './post-content';

interface CommentCardProps {
  comment: CommentFeedProps;
  onQuote?: () => void;
  onEdit?: () => void;
  handleQuoteClick: (quote: string) => void;
}

const CommentCard = ({
  comment,
  onQuote,
  onEdit,
  handleQuoteClick,
}: CommentCardProps) => {
  const {theme} = useGlobalStore(state => state);
  const [liked, setLiked] = useState(false);
  const navigate = useRouter();
  const {likeCommentRequest, dislikeCommentRequest} = usePostActions();
  const {currentUser} = useAuthStore(state => state);
  const {reportComment} = useReportActions();
  const handleLike = () => {
    likeCommentRequest.mutate(comment._id, {
      onSuccess(data, variables, context) {
        console.log(data, 'comment like');

        queryClient.invalidateQueries({queryKey: ['comment-feed-posts']});
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

  const handleDisLike = () => {
    dislikeCommentRequest.mutate(comment._id, {
      onSuccess(data, variables, context) {
        console.log(data, 'comment like');

        queryClient.invalidateQueries({queryKey: ['comment-feed-posts']});
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

  const handleReport = (commentId: string) => {
    const payload = {
      reason: 'No reason provided. Requires admin review.',
      commentId: commentId,
    };

    reportComment.mutate(payload, {
      onSuccess(data, variables, context) {
        console.log(data, 'report data');

        toast.success('Comment Reported', {
          description:
            'Thank you for reporting this comment. Our team will review it.',
        });
      },
      onError(error, variables, context) {
        console.log(error, 'comment report err');

        toast.error('Report Failed', {
          description:
            'Sorry, we were unable to submit your report. Please try again.',
        });
      },
    });
  };

  const handleQuote = () => {
    if (onQuote) {
      onQuote();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const renderCommentContent = () => {
    if (comment) {
      const theComment = comment.content;

      if (comment.quotedComment?.quotedContent) {
        const quoteName = comment.quotedComment?.quotedUser;

        const regularContent = comment.content;

        const {quotedImage, quotedContent} = comment.quotedComment;
        return (
          <>
            <div
              className="p-3 rounded-md mb-0 bg-gray-100 border-l-4 border-app dark:bg-background"
              onClick={() =>
                handleQuoteClick(comment.quotedComment?.quotedId as string)
              }>
              <div className="flex items-center gap-1 mb-1">
                <Link href={`/user/${quoteName}`}>
                  <Avatar className="w-5 h-5">
                    <AvatarImage
                      src={comment.quotedComment.quotedUserImage ?? undefined}
                    />
                    <AvatarFallback className="text-sm font-semibold text-app capitalize bg-gray-200">
                      {comment.quotedComment.quotedUser.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <p className="text-sm font-semibold text-app capitalize">
                  <Link href={`/user/${quoteName}`}>{quoteName}</Link>
                </p>
              </div>
              {/* <p className="text-gray-700">{quoteContent}</p> */}
              <PostContent content={quotedContent} />

              {quotedImage && quotedImage.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {quotedImage?.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden w-24 h-24 sm:w-32 sm:h-32">
                      <img
                        src={url}
                        alt={`Comment attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* <p className="whitespace-pre-wrap">{regularContent}</p> */}

            <div className="mt-3">
              <PostContent content={regularContent} />
            </div>
          </>
        );
      }

      if (!theComment && comment.quotedComment?.quotedContent) {
        const quoteName = comment.quotedComment?.quotedUser;
        // If no newline separation, all content after the name is the quote
        // If no delimiter separation, all content after the name is the quote
        const quoteContent = comment.quotedComment?.quotedContent;

        return (
          <div className="p-3 rounded-md mb-0 bg-gray-100 border-l-4 border-app dark:bg-background">
            {/* <p className="text-sm font-semibold text-app mb-1">@{quoteName}</p> */}

            <div className="flex items-center gap-1 mb-1">
              <Link href={`/user/${quoteName}`}>
                <Avatar className="w-5 h-5">
                  <AvatarImage
                    src={comment.quotedComment.quotedUserImage ?? undefined}
                  />
                  <AvatarFallback className="text-sm font-semibold text-app capitalize bg-gray-200">
                    {comment.quotedComment.quotedUser.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <p className="text-sm font-semibold text-app capitalize">
                <Link href={`/user/${quoteName}`}>{quoteName}</Link>
              </p>
            </div>

            <PostContent content={quoteContent} />
          </div>
        );
      }

      // If no quote or formatting needed, return content as is
      // return <p className="whitespace-pre-wrap">{comment.content}</p>;
      return <PostContent content={comment.content} />;
    }
  };

  const navigateToUserProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate.push(`/user/${comment.commentBy.username}`);
  };

  const isLiked = comment.likedBy.includes(currentUser?._id as string);
  const isCommentedUser = comment.commentBy?._id === currentUser?._id;
  return (
    <div className="border-b py-4 px-2 transition-colors hover:bg-app-hover border-app-border dark:hover:bg-background">
      <div className="flex gap-3">
        <Avatar
          className="w-10 h-10 active:scale-90 transition-transform duration-150"
          onClick={navigateToUserProfile}>
          <AvatarImage src={comment.commentBy.avatar} />
          <AvatarFallback className="capitalize text-app text-3xl">
            {comment.commentBy.username.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link
                href={`/user/${comment.commentBy.username}`}
                className="font-bold hover:underline capitalize active:scale-90 transition-transform duration-150">
                {comment.commentBy.username}
              </Link>

              <span className="text-app-gray">
                · replied {formatTimeAgo2(comment.createdAt as string)}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8">
                  <MoreHorizontal size={16} className="hidden md:block" />
                  <EllipsisVertical size={16} className="md:hidden" />
                  <span className="sr-only">Comment menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isCommentedUser && (
                  <DropdownMenuItem
                    onClick={() => handleReport(comment._id)}
                    className="cursor-pointer justify-center active:scale-90 transition-transform duration-150">
                    {/* <Flag size={16} className="mr-2" /> */}
                    Report
                  </DropdownMenuItem>
                )}
                {isCommentedUser && (
                  <DropdownMenuItem
                    onClick={handleEdit}
                    className="cursor-pointer justify-center active:scale-90 transition-transform duration-150">
                    {/* <Pencil size={16} className="mr-2" /> */}
                    Edit
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* <div className="mt-1">
            {renderCommentContent()}

            {comment.images &&
              comment.images?.length > 0 &&
              comment.images.map((img, idx) => (
                <div
                  className="mt-3 rounded-lg overflow-hidden"
                  key={img.public_id || idx}>
                  <img
                    src={img.secure_url}
                    alt={`comment attachment ${idx + 1}`}
                    // className="w-full h-auto max-h-96 object-cover rounded-lg"
                    className="w-full h-auto object-cover max-h-60 sm:max-h-80 md:max-h-96"
                  />
                </div>
              ))}
          </div> */}

          <div className="mt-1">
            {renderCommentContent()}

            {comment.images &&
              comment.images?.length > 0 &&
              comment.images.map((img, idx) => (
                <div
                  key={img.public_id || idx}
                  className="mt-3 h-60 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                  <img
                    src={img.secure_url}
                    alt={`comment attachment ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
          </div>

          <div className="flex gap-6 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-app-gray hover:text-app p-0 h-auto active:scale-90 transition-transform duration-150"
              //onClick={() => navigate.push(`/post/${comment.postId}/reply`)}
              onClick={handleQuote}>
              <MessageSquare size={16} className="mr-1" />
              <span className="text-xs">Reply</span>
            </Button>

            {/* <Button
              variant="ghost"
              size="sm"
              className="text-app-gray hover:text-app p-0 h-auto"
              onClick={handleQuote}>
              <Quote size={16} className="mr-1" />
              <span className="text-xs">Quote</span>
            </Button> */}

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'text-app-gray hover:text-red-500 p-0 h-auto active:scale-90 transition-transform duration-150',
                isLiked && 'text-red-500',
              )}
              onClick={handleLike}>
              <Heart
                size={16}
                className="mr-1"
                fill={isLiked ? 'currentColor' : 'none'}
              />
              <span className="text-xs">{comment.likedBy.length || 0}</span>
            </Button>

            {/* <Button
              variant="ghost"
              size="sm"
              className="text-app-gray hover:text-app p-0 h-auto">
              <Share size={16} />
            </Button> */}

            <Button
              variant="ghost"
              size="sm"
              className="text-app-gray hover:text-app p-0 h-auto active:scale-90 transition-transform duration-150"
              onClick={handleDisLike}>
              <ThumbsDown
                size={16}
                fill={
                  comment.dislikedBy.includes(currentUser?._id as string)
                    ? 'currentColor'
                    : 'none'
                }
              />
              <span className="text-xs">{comment.dislikedBy.length || 0}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentCard);

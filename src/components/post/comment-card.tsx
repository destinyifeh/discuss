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
import {CommentProps} from '@/types/post-item.type';
import clsx from 'clsx';
import React, {useState} from 'react';

import {formatTimeAgo2} from '@/lib/formatter';
import {
  EllipsisVertical,
  Flag,
  Heart,
  MessageSquare,
  MoreHorizontal,
  ThumbsDown,
} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {toast} from 'sonner';
import {PostContent} from './post-content';

interface CommentCardProps {
  comment: CommentProps;
  onQuote?: () => void;
}

const CommentCard = ({comment, onQuote}: CommentCardProps) => {
  const {theme} = useGlobalStore(state => state);
  const [liked, setLiked] = useState(false);
  const navigate = useRouter();

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleReport = () => {
    toast('Comment Reported', {
      description:
        'Thank you for reporting this comment. Our team will review it.',
    });
  };

  const handleQuote = () => {
    if (onQuote) {
      onQuote();
      return;
    }
  };

  // Function to parse and format any quoted content in the comment
  const renderCommentContent = () => {
    // console.log(comment.content, '333');
    // Check if the comment starts with a quote
    if (comment.content.startsWith('> ')) {
      //console.log(comment.content, 'yes sir');
      // Find the name and content in the quoted text
      const quoteContentStartIndex = comment.content.indexOf(': ');

      if (quoteContentStartIndex !== -1) {
        // Extract the quoted person's name
        const quoteName = comment.content.substring(2, quoteContentStartIndex);

        // Look for a double newline to separate quoted content from reply
        // const quoteEndIndex = comment.content.indexOf('\n\n');

        const quoteEndIndex = comment.content.indexOf('---QUOTE_END---');

        if (quoteEndIndex !== -1) {
          // If found, split into quote and reply
          const quoteContent = comment.content.substring(
            quoteContentStartIndex + 2,
            quoteEndIndex,
          );
          //const regularContent = comment.content.substring(quoteEndIndex + 2);
          const regularContent = comment.content.substring(quoteEndIndex + 15);

          return (
            <>
              <div
                className={clsx('p-3 rounded-md mb-0 border-l-4 border-app', {
                  'bg-gray-100': theme.type === 'default',
                  'bg-app-dark-bg/10 text-white': theme.type === 'dark',
                })}>
                <p className="text-sm font-semibold text-app mb-1">
                  @{quoteName}
                </p>
                {/* <p className="text-gray-700">{quoteContent}</p> */}
                <PostContent content={quoteContent} />
              </div>
              {/* <p className="whitespace-pre-wrap">{regularContent}</p> */}
              <PostContent content={regularContent} />
            </>
          );
        } else {
          // If no newline separation, all content after the name is the quote
          // If no delimiter separation, all content after the name is the quote
          const quoteContent = comment.content.substring(
            quoteContentStartIndex + 2,
          );

          return (
            <div
              className={clsx('p-3 rounded-md mb-0 border-l-4 border-app', {
                'bg-gray-100': theme.type === 'default',
                'bg-app-dark-bg/10 text-white': theme.type === 'dark',
              })}>
              <p className="text-sm font-semibold text-app mb-1">
                @{quoteName}
              </p>
              {/* <p className="text-gray-700">{quoteContent}</p> */}
              <PostContent content={quoteContent} />
            </div>
          );
        }
      }
    }

    // If no quote or formatting needed, return content as is
    // return <p className="whitespace-pre-wrap">{comment.content}</p>;
    return <PostContent content={comment.content} />;
  };

  return (
    <div
      className={clsx('border-b py-4 px-2 pb-10 transition-colors', {
        'hover:bg-app-hover border-app-border': theme.type === 'default',
        'hover:bg-app-dark-bg/10 border-app-dark-border': theme.type === 'dark',
      })}>
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.avatar} />
          <AvatarFallback>{comment.displayName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link
                href={`/profile/${comment.username}`}
                className="font-bold hover:underline">
                {comment.displayName}
              </Link>

              <span className="text-app-gray">
                · replied {formatTimeAgo2(comment.timestamp as string)}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className={clsx({
                  'hover:bg-app-dark-bg/10 hover:text-white':
                    theme.type === 'dark',
                })}>
                <Button variant="ghost" size="sm" className="h-8 w-8">
                  <MoreHorizontal size={16} className="hidden md:block" />
                  <EllipsisVertical size={16} className="md:hidden" />
                  <span className="sr-only">Comment menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={clsx({
                  'bg-app-dark-bg/10 border-app-dark-border text-app-dark-text':
                    theme.type === 'dark',
                })}>
                <DropdownMenuItem
                  onClick={handleReport}
                  className="cursor-pointer">
                  <Flag size={16} className="mr-2" />
                  Report comment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-1">
            {renderCommentContent()}
            {comment.image && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <img
                  src={comment.image}
                  alt="Comment attachment"
                  className="max-h-60 object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex gap-6 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className={clsx('text-app-gray hover:text-app p-0 h-auto', {
                'hover:bg-app-dark-bg/10': theme.type === 'dark',
              })}
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
                'text-app-gray hover:text-red-500 p-0 h-auto',
                liked && 'text-red-500',
                theme.type === 'dark' && 'hover:bg-app-dark-bg/10',
              )}
              onClick={handleLike}>
              <Heart
                size={16}
                className="mr-1"
                fill={liked ? 'currentColor' : 'none'}
              />
              <span className="text-xs">{comment.likes}</span>
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
              className={clsx('text-app-gray hover:text-app p-0 h-auto', {
                'hover:bg-app-dark-bg/10': theme.type === 'dark',
              })}>
              <ThumbsDown size={16} />
              <span className="text-xs">{comment.likes}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentCard);

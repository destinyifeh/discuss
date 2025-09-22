import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Edit, Flag, MoreHorizontal} from 'lucide-react';

import {formatTimeAgo} from '@/lib/formatter';
import {CommentFeedProps} from '@/types/post-item.type';
import Link from 'next/link';

interface CommentHeaderProps {
  comment: CommentFeedProps;
  isOwnComment: boolean;
  onEdit: () => void;
  onReport: () => void;
}

const CommentHeader = ({
  comment,
  isOwnComment,
  onEdit,
  onReport,
}: CommentHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Link
          href={`/profile/${comment.commentBy.username}`}
          className="font-bold hover:underline">
          {comment.commentBy.username}
        </Link>

        <span className="text-app-gray">
          · replied {formatTimeAgo(comment.createdAt as string)}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <MoreHorizontal size={16} />
            <span className="sr-only">Comment menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwnComment && (
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Edit size={16} className="mr-2" />
              Edit comment
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onReport} className="cursor-pointer">
            <Flag size={16} className="mr-2" />
            Report comment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CommentHeader;

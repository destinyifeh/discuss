import {Button} from '@/components/ui/button';
import {Heart, MessageSquare, Quote, Share} from 'lucide-react';

import {CommentProps} from '@/types/post-item.type';
import {useRouter} from 'next/navigation';

interface CommentActionsProps {
  comment: CommentProps;
  liked: boolean;
  onLike: () => void;
  onQuote: () => void;
}

const CommentActions = ({
  comment,
  liked,
  onLike,
  onQuote,
}: CommentActionsProps) => {
  const navigate = useRouter();

  return (
    <div className="flex gap-6 mt-3">
      <Button
        variant="ghost"
        size="sm"
        className="text-app-gray hover:text-app p-0 h-auto"
        onClick={() => navigate.push(`/post/${comment.postId}/reply`)}>
        <MessageSquare size={16} className="mr-1" />
        <span className="text-xs">Reply</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-app-gray hover:text-app p-0 h-auto"
        onClick={onQuote}>
        <Quote size={16} className="mr-1" />
        <span className="text-xs">Quote</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`text-app-gray hover:text-red-500 p-0 h-auto ${
          liked ? 'text-red-500' : ''
        }`}
        onClick={onLike}>
        <Heart
          size={16}
          className="mr-1"
          fill={liked ? 'currentColor' : 'none'}
        />
        <span className="text-xs">{comment.likes}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-app-gray hover:text-app p-0 h-auto">
        <Share size={16} />
      </Button>
    </div>
  );
};

export default CommentActions;

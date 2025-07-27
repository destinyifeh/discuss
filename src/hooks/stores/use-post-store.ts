import {
  CommentFeedProps,
  PostFeedProps,
  QuotedCommentProps,
} from '@/types/post-item.type';
import {create} from 'zustand';

type States = {
  postComment: CommentFeedProps | null;
  QuotedComment: QuotedCommentProps | null;
  thePost: PostFeedProps | null;
};

type Actions = {
  setPostComment: (comment: CommentFeedProps) => void;
  setQuotedComment: (quote: QuotedCommentProps) => void;
  setPost: (post: PostFeedProps) => void;
  resetCommentSection: () => void;
};

const initialState: States = {
  postComment: null,
  QuotedComment: {
    quotedContent: '',
    quotedUser: '',
  },
  thePost: null,
};

export const usePostStore = create<States & Actions>(set => ({
  ...initialState,
  setPostComment(state: CommentFeedProps) {
    console.log(state, 'state');
    set({postComment: state});
  },
  setPost: (post: PostFeedProps) => {
    set({thePost: post});
  },
  setQuotedComment(quote: QuotedCommentProps) {
    set({QuotedComment: quote});
  },
  resetCommentSection: () => {
    set(() => ({...initialState}));
  },
}));

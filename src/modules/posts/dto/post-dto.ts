import {QuotedCommentProps} from '@/types/post-item.type';
import {SectionName} from '@/types/section';

export type PostDto = {
  images?: File[];
  content: string;
  title: string;
  section: SectionName;
};

export type UpdatePostDto = {
  images?: File[];
  content: string;
  title: string;
  section: SectionName;
  postId: string;
  removedImageIds?: string[];
};

export type CommentDto = {
  images?: File[];
  content: string;
  postId: string;
  quotedComment?: QuotedCommentProps | null;
};

export type UpdateCommentDto = {
  images?: File[];
  content: string;
  postId: string;
  commentId: string;
  removedImageIds?: string[];
};

export const QUOTE_START = '---QUOTE_START---';
export const QUOTE_END = '---QUOTE_END---';

export const formattedQuoteContent = (quoteContent: string) => {
  const content = quoteContent
    .replace(/^---QUOTE_START---\s[\w]+:\s/gm, '')
    .replace(/---IMAGE:\[.*\]---/gm, '');

  const theContent =
    content.length > 100 ? content.slice(0, 100) + '...' : content || '';

  return theContent;
};

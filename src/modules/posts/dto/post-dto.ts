import {APP_NAME} from '@/constants/settings';
import {capitalizeWords} from '@/lib/formatter';
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

export const formattedPostTitle = (content: string) => {
  const plainContent = content.replace(/<[^>]*>/g, ''); // strip HTML

  // Remove links (http://, https://, www.)
  const cleanWords = plainContent
    .split(/\s+/)
    .filter(w => !/^https?:\/\//i.test(w) && !/^www\./i.test(w));

  // Build title or use fallback if empty
  let postTitle: string;
  if (cleanWords.length === 0) {
    postTitle = `Post from ${APP_NAME}`; // fallback
  } else {
    const rawTitle =
      cleanWords.length > 12
        ? cleanWords.slice(0, 12).join(' ') + '...'
        : cleanWords.join(' ');
    postTitle = capitalizeWords(rawTitle);
  }

  return postTitle;
};

'use client';

import {useMutation} from '@tanstack/react-query';
import {adminPostService} from './post';

export const useAdminPostActions = () => {
  const closeComment = useMutation({
    mutationFn: adminPostService.onCloseComment,
  });

  const deletePost = useMutation({
    mutationFn: adminPostService.deletePost,
  });

  return {
    closePostCommentRequest: closeComment,
    deletePostRequest: deletePost,
  };
};

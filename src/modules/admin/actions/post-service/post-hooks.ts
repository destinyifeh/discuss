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

  const promotePost = useMutation({
    mutationFn: adminPostService.promotePost,
  });

  const demotePost = useMutation({
    mutationFn: adminPostService.demotePost,
  });

  return {
    closePostCommentRequest: closeComment,
    deletePostRequest: deletePost,
    promotePost,
    demotePost,
  };
};

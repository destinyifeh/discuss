'use client';

import {useMutation} from '@tanstack/react-query';
import {postService} from './actions';

export const usePostActions = () => {
  const create = useMutation({
    mutationFn: postService.createPostRequestAction,
  });

  const update = useMutation({
    mutationFn: postService.updatePostRequestAction,
  });

  const likePost = useMutation({
    mutationFn: postService.likePostRequestAction,
  });

  const bookmarkPost = useMutation({
    mutationFn: postService.bookmarkPostRequestAction,
  });

  const createComment = useMutation({
    mutationFn: postService.createCommentRequestAction,
  });

  const updateComment = useMutation({
    mutationFn: postService.updateCommentRequestAction,
  });

  const likeComment = useMutation({
    mutationFn: postService.likeCommentRequestAction,
  });

  const dislikeComment = useMutation({
    mutationFn: postService.dislikeCommentRequestAction,
  });

  return {
    createPostRequest: create,
    updatePostRequest: update,
    createComment: createComment,
    updateCommentRequest: updateComment,
    likePostRequest: likePost,
    bookmarkPostRequest: bookmarkPost,
    likeCommentRequest: likeComment,
    dislikeCommentRequest: dislikeComment,
  };
};

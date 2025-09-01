import api from '@/lib/auth/api';
import {AdPlacementProps} from '@/types/ad-types';
import {
  CommentDto,
  PostDto,
  UpdateCommentDto,
  UpdatePostDto,
} from './dto/post-dto';

class PostService {
  async createPostRequestAction(post: PostDto) {
    const formData = new FormData();

    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('section', post.section);

    post.images?.forEach((image: File) => {
      formData.append('images', image);
    });
    try {
      return await api.post('/posts', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async updatePostRequestAction(post: UpdatePostDto) {
    const formData = new FormData();

    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('section', post.section);

    post.images?.forEach((image: File) => {
      formData.append('images', image);
    });

    post.removedImageIds?.forEach(id => {
      formData.append('removedImageIds', id);
    });

    try {
      return await api.patch(`/posts/${post.postId}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getPosts(page = 1, limit = 10, search?: string) {
    const params: any = {page, limit};
    if (search) params.search = search;

    const response = await api.get(`/posts`, {params});
    return response.data?.data;
  }

  async getPostRequestAction(postId: string) {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getPostBySlugRequestAction(slug: string) {
    try {
      const response = await api.get(`/posts/details/${slug}`);
      return response.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getPostCommentsCountRequestAction(postId: string) {
    const response = await api.get(`/posts/comment-count/${postId}`);
    return response.data;
  }

  async likePostRequestAction(postId: string) {
    const response = await api.patch(`/posts/${postId}/like`);
    return response.data;
  }

  async bookmarkPostRequestAction(postId: string) {
    const response = await api.patch(`/posts/${postId}/bookmark`);
    return response.data;
  }

  //comments

  async createCommentRequestAction(comment: CommentDto) {
    const formData = new FormData();

    formData.append('postId', comment.postId);
    formData.append('content', comment.content);
    if (comment.quotedComment) {
      formData.append('quotedComment', JSON.stringify(comment.quotedComment));
    }
    comment.images?.forEach((image: File) => {
      formData.append('images', image);
    });
    try {
      return await api.post('/comment', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }
  async getCommentFeeds(
    postId: string,
    page = 1,
    limit = 10,
    search?: string,
    pattern: string = '4, 9, 15',
    mode: string = 'pattern',
    placement: AdPlacementProps = 'details_feed',
  ) {
    const params: any = {page, limit, mode, placement};
    if (search) params.search = search;
    if (pattern) params.pattern = pattern;

    const response = await api.get(`/feeds/comments/${postId}`, {params});
    return response.data?.data;
  }

  //update comment
  async updateCommentRequestAction(comment: UpdateCommentDto) {
    const formData = new FormData();

    formData.append('postId', comment.postId);
    formData.append('content', comment.content);

    comment.images?.forEach((image: File) => {
      formData.append('images', image);
    });

    comment.removedImageIds?.forEach(id => {
      formData.append('removedImageIds', id);
    });
    try {
      return await api.patch(`/comment/update/${comment.commentId}`, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async likeCommentRequestAction(commentId: string) {
    const response = await api.patch(`/comment/${commentId}/like`);
    return response.data;
  }

  async dislikeCommentRequestAction(commentId: string) {
    const response = await api.patch(`/comment/${commentId}/dislike`);
    return response.data;
  }
}

export const postService = new PostService();

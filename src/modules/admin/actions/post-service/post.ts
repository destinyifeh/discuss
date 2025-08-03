import api from '@/lib/auth/api';

class AdminPostService {
  async getPostsContent(
    page = 1,
    limit = 10,
    search?: string,
    section?: string,
  ) {
    const params: any = {page, limit};

    if (search) params.search = search;
    if (section) params.section = section;
    const response = await api.get(`/posts/posts-with-comment-count`, {params});
    return response.data?.data;
  }

  async onCloseComment(postId: string) {
    const response = await api.patch(`/posts/${postId}/close-comment`);
    return response.data;
  }

  async deletePost(postId: string) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  }

  async getSectionPostCommentStats() {
    const response = await api.get(`/admin/section-post-comment-stats`);
    return response.data;
  }

  async getPostStats() {
    const response = await api.get(`/admin/post-stats`);
    return response.data;
  }
}

export const adminPostService = new AdminPostService();

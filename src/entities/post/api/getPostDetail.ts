import type { PostDetail } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getPostDetail = (postId: number) => {
  return apiClient.get<PostDetail>(API_ENDPOINTS.post.detail(postId));
};

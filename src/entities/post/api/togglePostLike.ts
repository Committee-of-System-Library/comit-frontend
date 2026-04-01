import type { ToggleLikeResponse } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const togglePostLike = (postId: number) => {
  return apiClient.post<ToggleLikeResponse>(API_ENDPOINTS.post.like(postId));
};

import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const deletePost = (postId: number) => {
  return apiClient.delete<void>(API_ENDPOINTS.post.delete(postId));
};

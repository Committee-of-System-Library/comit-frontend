import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const deleteComment = (commentId: number) => {
  return apiClient.delete<void>(API_ENDPOINTS.comment.detail(commentId));
};

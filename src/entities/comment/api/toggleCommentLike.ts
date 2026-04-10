import type { ToggleLikeResponse } from "@/entities/comment/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const toggleCommentLike = (commentId: number) => {
  return apiClient.post<ToggleLikeResponse>(
    API_ENDPOINTS.comment.like(commentId),
  );
};

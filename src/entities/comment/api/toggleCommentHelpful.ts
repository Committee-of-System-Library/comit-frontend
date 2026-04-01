import type { ToggleHelpfulResponse } from "@/entities/comment/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const toggleCommentHelpful = (commentId: number) => {
  return apiClient.post<ToggleHelpfulResponse>(
    API_ENDPOINTS.comment.helpful(commentId),
  );
};

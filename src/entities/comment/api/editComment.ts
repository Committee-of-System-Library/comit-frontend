import type { EditCommentRequest } from "@/entities/comment/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const editComment = (commentId: number, payload: EditCommentRequest) => {
  return apiClient.patch<void>(API_ENDPOINTS.comment.detail(commentId), {
    body: payload,
  });
};

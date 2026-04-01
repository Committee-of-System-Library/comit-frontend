import type { CommentListResponse } from "@/entities/comment/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getComments = (postId: number) => {
  return apiClient.get<CommentListResponse>(
    API_ENDPOINTS.comment.byPost(postId),
  );
};

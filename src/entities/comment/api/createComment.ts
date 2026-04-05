import type {
  CreateCommentRequest,
  CreateCommentResponse,
} from "@/entities/comment/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const createComment = (
  postId: number,
  payload: CreateCommentRequest,
) => {
  return apiClient.post<CreateCommentResponse>(
    API_ENDPOINTS.comment.byPost(postId),
    {
      body: payload,
    },
  );
};

import type { UpdatePostRequest } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const updatePost = (postId: number, payload: UpdatePostRequest) => {
  return apiClient.patch<void>(API_ENDPOINTS.post.update(postId), {
    body: payload,
  });
};

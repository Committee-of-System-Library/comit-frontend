import type { CreatePostRequest } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const createPost = (payload: CreatePostRequest) => {
  return apiClient.post<number>(API_ENDPOINTS.post.base, {
    body: payload,
  });
};

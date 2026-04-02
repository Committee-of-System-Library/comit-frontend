import type {
  PostListQuery,
  PostListResponse,
} from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getPosts = (params: PostListQuery) => {
  return apiClient.get<PostListResponse>(API_ENDPOINTS.post.base, {
    params: {
      boardType: params.boardType,
      cursor: params.cursor,
      size: params.size,
    },
  });
};

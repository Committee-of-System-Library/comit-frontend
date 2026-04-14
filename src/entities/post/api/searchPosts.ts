import type {
  PostSearchQuery,
  PostSearchResponse,
} from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const searchPosts = (params: PostSearchQuery) => {
  return apiClient.get<PostSearchResponse>(API_ENDPOINTS.post.search, {
    params: {
      keyword: params.keyword,
      boardType: params.boardType,
      cursor: params.cursor,
      size: params.size,
    },
  });
};

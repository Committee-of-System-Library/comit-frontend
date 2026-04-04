import type { HotPostsResponse } from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getHotPosts = () => {
  return apiClient.get<HotPostsResponse>(API_ENDPOINTS.post.hot);
};

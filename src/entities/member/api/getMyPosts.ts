import type { CursorPage, MyPost } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getMyPosts = (cursor?: number | null) => {
  return apiClient.get<CursorPage<MyPost>>(API_ENDPOINTS.member.myPosts, {
    params: { cursor, size: 10 },
  });
};

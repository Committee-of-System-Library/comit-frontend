import type { CursorPage, MyLike } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getMyLikes = (cursor?: number | null) => {
  return apiClient.get<CursorPage<MyLike>>(API_ENDPOINTS.member.myLikes, {
    params: { cursor, size: 10 },
  });
};

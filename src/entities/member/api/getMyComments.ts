import type { CursorPage, MyComment } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getMyComments = (cursor?: number | null) => {
  return apiClient.get<CursorPage<MyComment>>(API_ENDPOINTS.member.myComments, {
    params: { cursor, size: 10 },
  });
};

import type { CursorPage, MyComment } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

interface MyCommentsResponse {
  comments: MyComment[];
  nextCursorId: number | null;
  hasNext: boolean;
}

export const getMyComments = async (
  cursor?: number | null,
): Promise<CursorPage<MyComment>> => {
  const response = await apiClient.get<MyCommentsResponse>(
    API_ENDPOINTS.member.myComments,
    { params: { cursor, size: 10 } },
  );
  return {
    items: response.comments,
    nextCursor: response.nextCursorId,
    hasNext: response.hasNext,
    totalCount: response.comments.length,
  };
};

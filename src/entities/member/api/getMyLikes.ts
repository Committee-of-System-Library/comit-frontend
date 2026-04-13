import type { CursorPage, MyLike } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

interface MyLikesResponse {
  posts: MyLike[];
  nextCursorId: number | null;
  hasNext: boolean;
}

export const getMyLikes = async (
  cursor?: number | null,
): Promise<CursorPage<MyLike>> => {
  const response = await apiClient.get<MyLikesResponse>(
    API_ENDPOINTS.member.myLikes,
    { params: { cursor, size: 10 } },
  );
  return {
    items: response.posts,
    nextCursor: response.nextCursorId,
    hasNext: response.hasNext,
    totalCount: response.posts.length,
  };
};

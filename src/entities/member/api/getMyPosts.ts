import type { CursorPage, MyPost } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

interface MyPostsResponse {
  posts: MyPost[];
  nextCursorId: number | null;
  hasNext: boolean;
}

export const getMyPosts = async (
  cursor?: number | null,
): Promise<CursorPage<MyPost>> => {
  const response = await apiClient.get<MyPostsResponse>(
    API_ENDPOINTS.member.myPosts,
    { params: { cursor, size: 10 } },
  );
  return {
    items: response.posts,
    nextCursor: response.nextCursorId,
    hasNext: response.hasNext,
    totalCount: response.posts.length,
  };
};

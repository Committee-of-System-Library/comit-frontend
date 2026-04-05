import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/entities/post/api/getPosts";
import type { PostListQuery } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

interface UsePostListQueryOptions extends PostListQuery {
  enabled?: boolean;
}

export const usePostListQuery = ({
  boardType,
  cursor,
  size = 20,
  enabled = true,
}: UsePostListQueryOptions) => {
  return useQuery({
    enabled,
    queryFn: () => getPosts({ boardType, cursor, size }),
    queryKey: queryKeys.post.list({ boardType, cursor, size }),
  });
};

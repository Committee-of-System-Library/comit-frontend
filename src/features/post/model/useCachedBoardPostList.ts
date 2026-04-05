import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/entities/post/api/getPosts";
import type { PostListQuery } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

export const useCachedBoardPostList = ({
  boardType,
  cursor,
  size = 20,
}: PostListQuery) => {
  return useQuery({
    enabled: false,
    gcTime: Infinity,
    queryFn: () => getPosts({ boardType, cursor, size }),
    queryKey: queryKeys.post.list({ boardType, cursor, size }),
    staleTime: Infinity,
  });
};

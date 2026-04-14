import { useQuery } from "@tanstack/react-query";

import { searchPosts } from "@/entities/post/api/searchPosts";
import type { BoardType } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

interface UseSearchPostsQueryOptions {
  keyword: string;
  boardType?: BoardType;
  cursor?: number;
  size?: number;
}

export const useSearchPostsQuery = ({
  keyword,
  boardType,
  cursor,
  size = 20,
}: UseSearchPostsQueryOptions) => {
  return useQuery({
    enabled: keyword.trim().length > 0,
    queryFn: () =>
      searchPosts({ keyword: keyword.trim(), boardType, cursor, size }),
    queryKey: queryKeys.post.search(keyword.trim(), cursor),
  });
};

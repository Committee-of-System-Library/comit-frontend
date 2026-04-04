import { useQuery } from "@tanstack/react-query";

import { getHotPosts } from "@/entities/post/api/getHotPosts";
import { queryKeys } from "@/shared/api/query-keys";

interface UseHotPostsQueryOptions {
  enabled?: boolean;
}

export const useHotPostsQuery = (options: UseHotPostsQueryOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    enabled,
    queryFn: getHotPosts,
    queryKey: queryKeys.post.hot(),
  });
};

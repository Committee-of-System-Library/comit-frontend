import { useQuery } from "@tanstack/react-query";

import { getHotPosts } from "@/entities/post/api/getHotPosts";
import { mapHotPostSummaryToHotPost } from "@/features/post/model/postUiMappers";
import { queryKeys } from "@/shared/api/query-keys";

interface UseHotPostsQueryOptions {
  enabled?: boolean;
}

const HOT_POSTS_STALE_TIME = 5 * 60 * 1000;
const HOT_POSTS_GC_TIME = 30 * 60 * 1000;

export const useHotPostsQuery = (options: UseHotPostsQueryOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    enabled,
    gcTime: HOT_POSTS_GC_TIME,
    queryFn: getHotPosts,
    queryKey: queryKeys.post.hot(),
    refetchOnWindowFocus: false,
    select: (data) =>
      (Array.isArray(data?.posts) ? data.posts : []).map(
        mapHotPostSummaryToHotPost,
      ),
    staleTime: HOT_POSTS_STALE_TIME,
  });
};

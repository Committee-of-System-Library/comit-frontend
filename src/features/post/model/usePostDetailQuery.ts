import { useQuery } from "@tanstack/react-query";

import { getPostDetail } from "@/entities/post/api/getPostDetail";
import { queryKeys } from "@/shared/api/query-keys";

interface UsePostDetailQueryOptions {
  enabled?: boolean;
  postId: number;
}

export const usePostDetailQuery = ({
  postId,
  enabled = true,
}: UsePostDetailQueryOptions) => {
  return useQuery({
    enabled: enabled && postId > 0,
    queryFn: () => getPostDetail(postId),
    queryKey: queryKeys.post.detail(postId),
  });
};

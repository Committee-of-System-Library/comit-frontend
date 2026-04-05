import { useQuery } from "@tanstack/react-query";

import { getComments } from "@/entities/comment/api/getComments";
import { queryKeys } from "@/shared/api/query-keys";

interface UseCommentsQueryParams {
  postId: number;
  enabled?: boolean;
}

export const useCommentsQuery = ({
  postId,
  enabled = true,
}: UseCommentsQueryParams) => {
  return useQuery({
    queryKey: queryKeys.comment.byPost(postId),
    queryFn: () => getComments(postId),
    enabled: !!postId && enabled,
  });
};

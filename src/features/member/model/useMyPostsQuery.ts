import { useQuery } from "@tanstack/react-query";

import { getMyPosts } from "@/entities/member/api/getMyPosts";
import { queryKeys } from "@/shared/api/query-keys";

export const useMyPostsQuery = () => {
  return useQuery({
    queryKey: queryKeys.member.myPosts(),
    queryFn: () => getMyPosts(),
  });
};

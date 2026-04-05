import { useQuery } from "@tanstack/react-query";

import { getMyLikes } from "@/entities/member/api/getMyLikes";
import { queryKeys } from "@/shared/api/query-keys";

export const useMyLikesQuery = () => {
  return useQuery({
    queryKey: queryKeys.member.myLikes(),
    queryFn: () => getMyLikes(),
  });
};

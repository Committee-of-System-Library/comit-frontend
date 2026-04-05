import { useQuery } from "@tanstack/react-query";

import { getMyComments } from "@/entities/member/api/getMyComments";
import { queryKeys } from "@/shared/api/query-keys";

export const useMyCommentsQuery = () => {
  return useQuery({
    queryKey: queryKeys.member.myComments(),
    queryFn: () => getMyComments(),
  });
};

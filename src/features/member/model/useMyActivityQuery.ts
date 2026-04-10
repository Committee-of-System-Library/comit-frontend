import { useQuery } from "@tanstack/react-query";

import { getMyActivity } from "@/entities/member/api/getMyActivity";
import { queryKeys } from "@/shared/api/query-keys";

export const useMyActivityQuery = () => {
  return useQuery({
    queryKey: queryKeys.member.myActivity(),
    queryFn: () => getMyActivity(),
  });
};

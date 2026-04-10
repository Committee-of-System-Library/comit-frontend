import { useQuery } from "@tanstack/react-query";

import { getMyProfile } from "@/entities/member/api/getMyProfile";
import { isApiHttpError } from "@/shared/api/http-error";
import { queryKeys } from "@/shared/api/query-keys";

interface UseMyProfileQueryOptions {
  enabled?: boolean;
}

export const useMyProfileQuery = (options: UseMyProfileQueryOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    enabled,
    queryFn: async () => {
      try {
        return await getMyProfile();
      } catch (error) {
        if (isApiHttpError(error) && [401, 403].includes(error.status)) {
          return null;
        }

        throw error;
      }
    },
    queryKey: queryKeys.member.me(),
  });
};

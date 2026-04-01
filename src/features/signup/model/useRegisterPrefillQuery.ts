import { useQuery } from "@tanstack/react-query";

import { getRegisterPrefill } from "@/entities/auth/api/getRegisterPrefill";
import { queryKeys } from "@/shared/api/query-keys";

interface UseRegisterPrefillQueryOptions {
  enabled?: boolean;
}

export const useRegisterPrefillQuery = (
  options: UseRegisterPrefillQueryOptions = {},
) => {
  const { enabled = true } = options;

  return useQuery({
    enabled,
    queryFn: getRegisterPrefill,
    queryKey: queryKeys.auth.registerPrefill(),
  });
};

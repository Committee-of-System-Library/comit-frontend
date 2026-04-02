import { useMutation, useQueryClient } from "@tanstack/react-query";

import { register } from "@/entities/auth/api/register";
import type { RegisterRequest } from "@/entities/auth/model/types";
import { queryKeys } from "@/shared/api/query-keys";

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.member.all }),
      ]);
    },
  });
};

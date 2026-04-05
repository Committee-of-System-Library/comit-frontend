import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateNickname } from "@/entities/member/api/updateNickname";
import { queryKeys } from "@/shared/api/query-keys";

export const useUpdateNicknameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nickname: string) => updateNickname({ nickname }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.member.me() });
    },
  });
};

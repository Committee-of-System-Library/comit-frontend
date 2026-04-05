import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudentNumberVisibility } from "@/entities/member/api/updateStudentNumberVisibility";
import { queryKeys } from "@/shared/api/query-keys";

export const useUpdateStudentNumberVisibilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (visible: boolean) => updateStudentNumberVisibility(visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.member.me() });
    },
  });
};

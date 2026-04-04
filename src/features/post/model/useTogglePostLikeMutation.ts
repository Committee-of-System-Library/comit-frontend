import { useMutation, useQueryClient } from "@tanstack/react-query";

import { togglePostLike } from "@/entities/post/api/togglePostLike";
import { queryKeys } from "@/shared/api/query-keys";

export const useTogglePostLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => togglePostLike(postId),
    onSuccess: async (_, postId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.post.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.post.detail(postId),
        }),
      ]);
    },
  });
};

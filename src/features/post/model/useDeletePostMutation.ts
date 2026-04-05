import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePost } from "@/entities/post/api/deletePost";
import { queryKeys } from "@/shared/api/query-keys";

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: async (_, postId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.post.all }),
        queryClient.removeQueries({ queryKey: queryKeys.post.detail(postId) }),
      ]);
    },
  });
};

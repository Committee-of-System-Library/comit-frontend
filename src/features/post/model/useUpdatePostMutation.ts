import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePost } from "@/entities/post/api/updatePost";
import type { UpdatePostRequest } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

interface UpdatePostMutationVariables {
  payload: UpdatePostRequest;
  postId: number;
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }: UpdatePostMutationVariables) =>
      updatePost(postId, payload),
    onSuccess: async (_, { postId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.post.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.post.detail(postId),
        }),
      ]);
    },
  });
};

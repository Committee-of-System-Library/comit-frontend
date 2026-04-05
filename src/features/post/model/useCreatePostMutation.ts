import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPost } from "@/entities/post/api/createPost";
import type { CreatePostRequest } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.post.all });
    },
  });
};

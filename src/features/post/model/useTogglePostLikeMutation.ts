import { useMutation, useQueryClient } from "@tanstack/react-query";

import { togglePostLike } from "@/entities/post/api/togglePostLike";
import type { PostDetail } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

export const useTogglePostLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => togglePostLike(postId),
    onMutate: async (postId) => {
      const detailQueryKey = queryKeys.post.detail(postId);

      await queryClient.cancelQueries({ queryKey: detailQueryKey });

      const previousPost =
        queryClient.getQueryData<PostDetail>(detailQueryKey) ?? null;

      if (previousPost) {
        const nextLiked = !previousPost.likedByMe;

        queryClient.setQueryData<PostDetail>(detailQueryKey, {
          ...previousPost,
          likeCount: Math.max(0, previousPost.likeCount + (nextLiked ? 1 : -1)),
          likedByMe: nextLiked,
        });
      }

      return { detailQueryKey, previousPost };
    },
    onError: (_error, _postId, context) => {
      if (!context?.previousPost) {
        return;
      }

      queryClient.setQueryData(context.detailQueryKey, context.previousPost);
    },
    onSettled: async (_data, _error, postId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.post.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.post.detail(postId),
        }),
      ]);
    },
  });
};

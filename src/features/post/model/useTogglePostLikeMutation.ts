import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";

import {
  applyOptimisticPostLikeUpdate,
  type PostLikeCacheData,
} from "./postLikeCache";

import { togglePostLike } from "@/entities/post/api/togglePostLike";
import type { PostDetail } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

type PostLikeSnapshot = readonly [QueryKey, PostLikeCacheData | undefined];

type TogglePostLikeMutationContext = {
  snapshots: PostLikeSnapshot[];
};

export const useTogglePostLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => togglePostLike(postId),
    onMutate: async (postId): Promise<TogglePostLikeMutationContext> => {
      await queryClient.cancelQueries({ queryKey: queryKeys.post.all });

      const previousPost =
        queryClient.getQueryData<PostDetail>(queryKeys.post.detail(postId)) ??
        null;

      if (!previousPost) {
        return { snapshots: [] };
      }

      const nextLiked = !previousPost.likedByMe;
      const snapshots = queryClient.getQueriesData<PostLikeCacheData>({
        queryKey: queryKeys.post.all,
      });

      queryClient.setQueriesData<PostLikeCacheData>(
        { queryKey: queryKeys.post.all },
        (current) => applyOptimisticPostLikeUpdate(current, postId, nextLiked),
      );

      return { snapshots };
    },
    onError: (_error, _postId, context) => {
      if (!context?.snapshots.length) {
        return;
      }

      context.snapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { createComment } from "@/entities/comment/api/createComment";
import type {
  CreateCommentRequest,
  CreateCommentResponse,
} from "@/entities/comment/model/types";
import { queryKeys } from "@/shared/api/query-keys";

interface UseCreateCommentParams {
  postId: number;
  payload: CreateCommentRequest;
}

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }: UseCreateCommentParams) =>
      createComment(postId, payload),

    onSuccess: async (_data: CreateCommentResponse, { postId }) => {
      toast.success("댓글이 작성되었습니다.");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.comment.byPost(postId),
      });
    },
    onError: () => {
      toast.error("댓글 작성 중 오류가 발생했습니다.");
    },
  });
};

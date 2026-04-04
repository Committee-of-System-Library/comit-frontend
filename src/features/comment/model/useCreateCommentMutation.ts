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

    onSuccess: async (data: CreateCommentResponse, { postId }) => {
      console.info("댓글 작성 완료/새로 생성된 댓글 ID:", data);
      toast.success("댓글이 성공적으로 작성되었습니다.");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.comment.byPost(postId),
      });
    },
  });
};

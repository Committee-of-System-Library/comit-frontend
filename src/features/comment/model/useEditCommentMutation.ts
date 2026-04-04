import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { editComment } from "@/entities/comment/api/editComment";
import type { EditCommentRequest } from "@/entities/comment/model/types";
import { queryKeys } from "@/shared/api/query-keys";

interface useEditCommentParams {
  commentId: number;
  postId: number;
  payload: EditCommentRequest;
}

export const useEditCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, payload }: useEditCommentParams) =>
      editComment(commentId, payload),

    onSuccess: async (_, { postId }) => {
      toast.success("댓글이 수정되었습니다.");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.comment.byPost(postId),
      });
    },
    onError: () => {
      toast.error("댓글 수정 중 오류가 발생했습니다.");
    },
  });
};

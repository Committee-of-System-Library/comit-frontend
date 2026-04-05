import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { deleteComment } from "@/entities/comment/api/deleteComment";
import { queryKeys } from "@/shared/api/query-keys";

interface UseDeleteCommentParams {
  commentId: number;
  postId: number;
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: UseDeleteCommentParams) =>
      deleteComment(commentId),

    onSuccess: async (_, { postId }) => {
      toast.success("댓글이 삭제되었습니다.");

      await queryClient.invalidateQueries({
        queryKey: queryKeys.comment.byPost(postId),
      });
    },
    onError: () => {
      toast.error("댓글 삭제 중 오류가 발생했습니다.");
    },
  });
};

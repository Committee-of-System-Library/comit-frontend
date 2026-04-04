import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/apis/client";
import type {
  AdminCommentPageResponse,
  AdminListParams,
  AdminVisibilityPayload,
} from "@/types/admin";

interface AdminCommentListParams extends AdminListParams {
  postId?: number;
}

interface UpdateCommentVisibilityParams {
  commentId: number;
  payload: AdminVisibilityPayload;
}

const adminCommentKeys = {
  all: ["admin", "comments"] as const,
  list: (params: AdminCommentListParams) =>
    [...adminCommentKeys.all, params] as const,
};

const getAdminComments = (params: AdminCommentListParams) =>
  client.get<AdminCommentPageResponse>("/admin/comments", { params });

const deleteComment = (commentId: number) =>
  client.delete<void>(`/admin/comments/${commentId}`);

const patchCommentVisibility = ({
  commentId,
  payload,
}: UpdateCommentVisibilityParams) =>
  client.patch<void>(`/admin/comments/${commentId}/visibility`, payload);

export const useAdminComments = (params: AdminCommentListParams) =>
  useQuery({
    queryKey: adminCommentKeys.list(params),
    queryFn: () => getAdminComments(params),
  });

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminCommentKeys.all });
    },
  });
};

export const usePatchCommentVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchCommentVisibility,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminCommentKeys.all });
    },
  });
};

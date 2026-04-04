import { useMutation } from "@tanstack/react-query";

import { reportPost } from "@/entities/post/api/reportPost";
import type { ReportRequest } from "@/entities/post/model/types";

interface ReportPostMutationVariables {
  payload: ReportRequest;
  postId: number;
}

export const useReportPostMutation = () => {
  return useMutation({
    mutationFn: ({ postId, payload }: ReportPostMutationVariables) =>
      reportPost(postId, payload),
  });
};

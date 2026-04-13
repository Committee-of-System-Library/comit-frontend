import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { reportPost } from "@/entities/post/api/reportPost";
import type {
  ReportRequest,
  ReportResponse,
} from "@/entities/post/model/types";

interface ReportPostMutationVariables {
  payload: ReportRequest;
  postId: number;
}

export const useReportPostMutation = () => {
  return useMutation({
    mutationFn: ({ postId, payload }: ReportPostMutationVariables) =>
      reportPost(postId, payload),
    onSuccess: (data: ReportResponse) => {
      console.info(`게시글 신고 접수 완료 (신고번호: ${data.reportId})`);
      toast.success("신고가 정상적으로 접수되었습니다.");
    },
    onError: () => {
      toast.error("신고 처리 중 오류가 발생했습니다.");
    },
  });
};

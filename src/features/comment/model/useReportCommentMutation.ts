import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { reportComment } from "@/entities/comment/api/reportComment";
import type {
  ReportRequest,
  ReportResponse,
} from "@/entities/comment/model/types";

interface UseReportCommentParams {
  commentId: number;
  payload: ReportRequest;
}

export const useReportCommentMutation = () => {
  return useMutation({
    mutationFn: ({ commentId, payload }: UseReportCommentParams) =>
      reportComment(commentId, payload),

    onSuccess: (data: ReportResponse) => {
      console.info(`신고 접수 완료 (신고번호: ${data.reportId})`);
      toast.success("신고가 정상적으로 접수되었습니다.");
    },

    onError: () => {
      toast.error("신고 처리 중 오류가 발생했습니다.");
    },
  });
};

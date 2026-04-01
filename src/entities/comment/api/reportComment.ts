import type {
  ReportRequest,
  ReportResponse,
} from "@/entities/comment/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const reportComment = (commentId: number, payload: ReportRequest) => {
  return apiClient.post<ReportResponse>(
    API_ENDPOINTS.comment.report(commentId),
    {
      body: payload,
    },
  );
};

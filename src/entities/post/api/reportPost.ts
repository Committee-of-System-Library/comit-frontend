import type {
  ReportRequest,
  ReportResponse,
} from "@/entities/post/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const reportPost = (postId: number, payload: ReportRequest) => {
  return apiClient.post<ReportResponse>(API_ENDPOINTS.post.report(postId), {
    body: payload,
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/apis/client";
import type {
  AdminListParams,
  AdminReportDetail,
  AdminReportPageResponse,
  ReportStatus,
  ReportTargetType,
  ReviewReportPayload,
} from "@/types/admin";

interface AdminReportListParams extends AdminListParams {
  status?: ReportStatus;
  targetType?: ReportTargetType;
}

interface ReviewReportParams {
  payload: ReviewReportPayload;
  reportId: number;
}

const adminReportKeys = {
  all: ["admin", "reports"] as const,
  detail: (reportId: number) =>
    [...adminReportKeys.all, "detail", reportId] as const,
  list: (params: AdminReportListParams) =>
    [...adminReportKeys.all, params] as const,
};

const getAdminReports = (params: AdminReportListParams) =>
  client.get<AdminReportPageResponse>("/admin/reports", { params });

const getAdminReport = (reportId: number) =>
  client.get<AdminReportDetail>(`/admin/reports/${reportId}`);

const patchReportStatus = ({ payload, reportId }: ReviewReportParams) =>
  client.patch<void>(`/admin/reports/${reportId}/status`, payload);

export const useAdminReports = (params: AdminReportListParams) =>
  useQuery({
    queryKey: adminReportKeys.list(params),
    queryFn: () => getAdminReports(params),
  });

export const useAdminReport = (reportId: number | null) =>
  useQuery({
    queryKey: adminReportKeys.detail(reportId ?? -1),
    queryFn: () => getAdminReport(reportId as number),
    enabled: reportId !== null,
  });

export const usePatchReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchReportStatus,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminReportKeys.all });
      void queryClient.invalidateQueries({
        queryKey: adminReportKeys.detail(variables.reportId),
      });
    },
  });
};

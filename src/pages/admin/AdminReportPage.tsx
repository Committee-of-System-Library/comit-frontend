import { useState } from "react";

import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import {
  useAdminReport,
  useAdminReports,
  usePatchReportStatus,
} from "@/apis/modules/admin-report";
import { AdminEmptyState } from "@/shared/ui/AdminEmptyState/AdminEmptyState";
import { AdminReportDetailModal } from "@/shared/ui/AdminReportDetailModal/AdminReportDetailModal";
import {
  AdminStatusBadge,
  type AdminStatusTone,
} from "@/shared/ui/AdminStatusBadge/AdminStatusBadge";
import { Button } from "@/shared/ui/button/Button";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import type { ReportStatus, ReportTargetType } from "@/types/admin";
import { formatDateTime } from "@/utils/formatDateTime";

const PAGE_SIZE = 10;

const reportStatusFilters: Array<{ label: string; value?: ReportStatus }> = [
  { label: "전체", value: undefined },
  { label: "접수", value: "RECEIVED" },
  { label: "검토", value: "REVIEWED" },
  { label: "조치", value: "ACTIONED" },
  { label: "반려", value: "DISMISSED" },
];

const targetFilters: Array<{ label: string; value?: ReportTargetType }> = [
  { label: "전체 대상", value: undefined },
  { label: "게시글", value: "POST" },
  { label: "댓글", value: "COMMENT" },
];

const reportStatusLabels: Record<ReportStatus, string> = {
  ACTIONED: "조치 완료",
  DISMISSED: "반려",
  RECEIVED: "접수",
  REVIEWED: "검토 완료",
};

const reportStatusTones: Record<ReportStatus, AdminStatusTone> = {
  ACTIONED: "green",
  DISMISSED: "neutral",
  RECEIVED: "yellow",
  REVIEWED: "blue",
};

const parsePage = (pageParam: string | null) => {
  const numericPage = Number(pageParam);
  return Number.isFinite(numericPage) && numericPage > 0 ? numericPage : 1;
};

const AdminReportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const currentPage = parsePage(searchParams.get("page"));
  const statusParam = searchParams.get("status");
  const targetTypeParam = searchParams.get("targetType");
  const status =
    statusParam === "RECEIVED" ||
    statusParam === "REVIEWED" ||
    statusParam === "DISMISSED" ||
    statusParam === "ACTIONED"
      ? statusParam
      : undefined;
  const targetType =
    targetTypeParam === "POST" || targetTypeParam === "COMMENT"
      ? targetTypeParam
      : undefined;

  const reportsQuery = useAdminReports({
    page: currentPage - 1,
    size: PAGE_SIZE,
    status,
    targetType,
  });
  const reportDetailQuery = useAdminReport(selectedReportId);
  const patchReportStatusMutation = usePatchReportStatus();

  const updateSearchParams = (nextValues: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value === null) {
        nextParams.delete(key);
        return;
      }

      nextParams.set(key, value);
    });

    setSearchParams(nextParams);
  };

  const handleStatusFilter = (nextStatus?: ReportStatus) => {
    updateSearchParams({
      page: "1",
      status: nextStatus ?? null,
    });
  };

  const handleTargetFilter = (nextTargetType?: ReportTargetType) => {
    updateSearchParams({
      page: "1",
      targetType: nextTargetType ?? null,
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: String(page) });
  };

  const handleSelectStatus = async (nextStatus: ReportStatus) => {
    if (selectedReportId === null) {
      return;
    }

    try {
      await patchReportStatusMutation.mutateAsync({
        reportId: selectedReportId,
        payload: { status: nextStatus },
      });
      toast.success("신고 상태를 업데이트했습니다.");
      setSelectedReportId(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "신고 상태를 업데이트하지 못했습니다.",
      );
    }
  };

  const reports = reportsQuery.data?.reports ?? [];
  const isEmpty = !reportsQuery.isLoading && reports.length === 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-head-03 text-text-primary">신고 관리</h1>
          <p className="mt-2 text-body-02 text-text-secondary">
            접수된 신고를 확인하고 상세 모달에서 바로 검토 상태를 바꿀 수
            있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {reportStatusFilters.map((filter) => {
            const isActive = filter.value === status;

            return (
              <Button
                key={filter.label}
                onClick={() => handleStatusFilter(filter.value)}
                variant={isActive ? "primary" : "secondary"}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {targetFilters.map((filter) => {
          const isActive = filter.value === targetType;

          return (
            <Button
              key={filter.label}
              onClick={() => handleTargetFilter(filter.value)}
              variant={isActive ? "primary" : "secondary"}
            >
              {filter.label}
            </Button>
          );
        })}
      </div>

      {reportsQuery.isError ? (
        <div className="rounded-3xl border border-error-03/30 bg-error-03/10 px-6 py-10 text-center text-body-02 text-error-02">
          {reportsQuery.error instanceof Error
            ? reportsQuery.error.message
            : "신고 목록을 불러오지 못했습니다."}
        </div>
      ) : isEmpty ? (
        <AdminEmptyState
          description="선택한 조건에 맞는 신고가 없습니다."
          title="표시할 신고가 없습니다."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border-deactivated bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-background-dark">
                <tr className="text-left text-label-05 text-text-secondary">
                  <th className="px-5 py-4">신고 내용</th>
                  <th className="px-5 py-4">대상</th>
                  <th className="px-5 py-4">신고자</th>
                  <th className="px-5 py-4">상태</th>
                  <th className="px-5 py-4">접수 일시</th>
                  <th className="px-5 py-4">액션</th>
                </tr>
              </thead>
              <tbody>
                {reportsQuery.isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={`report-skeleton-${index}`}
                        className="border-t border-border-deactivated"
                      >
                        <td className="px-5 py-4" colSpan={6}>
                          <div className="h-5 animate-pulse rounded-full bg-gray-100" />
                        </td>
                      </tr>
                    ))
                  : reports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-t border-border-deactivated text-body-02 text-text-primary"
                      >
                        <td className="max-w-[360px] px-5 py-4">
                          <div className="line-clamp-2">{report.message}</div>
                        </td>
                        <td className="px-5 py-4">
                          {report.targetType} #{report.targetId}
                        </td>
                        <td className="px-5 py-4">{report.reporterNickname}</td>
                        <td className="px-5 py-4">
                          <AdminStatusBadge
                            tone={reportStatusTones[report.status]}
                          >
                            {reportStatusLabels[report.status]}
                          </AdminStatusBadge>
                        </td>
                        <td className="px-5 py-4 text-text-secondary">
                          {formatDateTime(report.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <Button
                            onClick={() => setSelectedReportId(report.id)}
                            variant="secondary"
                          >
                            상세 보기
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportsQuery.data && reportsQuery.data.totalPages > 1 ? (
        <div>
          <div className="text-right text-caption-01 text-text-secondary">
            총 {reportsQuery.data.totalElements.toLocaleString("ko-KR")}건
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={reportsQuery.data.totalPages}
            />
          </div>
        </div>
      ) : null}

      {selectedReportId !== null ? (
        <AdminReportDetailModal
          detail={reportDetailQuery.data ?? null}
          errorMessage={
            reportDetailQuery.isError &&
            reportDetailQuery.error instanceof Error
              ? reportDetailQuery.error.message
              : null
          }
          isLoading={reportDetailQuery.isLoading}
          isSubmitting={patchReportStatusMutation.isPending}
          onClose={() => setSelectedReportId(null)}
          onSelectStatus={handleSelectStatus}
        />
      ) : null}
    </section>
  );
};

export default AdminReportPage;

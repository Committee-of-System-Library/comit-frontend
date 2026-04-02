import { createPortal } from "react-dom";

import { Button } from "@/shared/ui/button/Button";
import type { AdminReportDetail, ReportStatus } from "@/types/admin";
import { formatDateTime } from "@/utils/formatDateTime";

interface AdminReportDetailModalProps {
  detail: AdminReportDetail | null;
  errorMessage?: string | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSelectStatus: (status: ReportStatus) => void;
}

const reviewActions: Array<{ label: string; status: ReportStatus }> = [
  { label: "조치 완료", status: "ACTIONED" },
  { label: "검토 완료", status: "REVIEWED" },
  { label: "반려", status: "DISMISSED" },
];

export const AdminReportDetailModal = ({
  detail,
  errorMessage,
  isLoading = false,
  isSubmitting = false,
  onClose,
  onSelectStatus,
}: AdminReportDetailModalProps) => {
  const portalRoot = document.getElementById("modal-portal");

  if (!portalRoot) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
      <section className="w-full max-w-[560px] rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-subtitle-01 text-text-primary">신고 상세</h2>
            <p className="mt-1 text-body-02 text-text-secondary">
              신고 내용과 처리 상태를 확인하고 즉시 조치할 수 있습니다.
            </p>
          </div>
          <Button onClick={onClose} variant="secondary">
            닫기
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-border-deactivated bg-background-dark px-4 py-10 text-center text-body-02 text-text-secondary">
            신고 상세를 불러오는 중입니다.
          </div>
        ) : errorMessage ? (
          <div className="mt-8 rounded-2xl border border-error-03/30 bg-error-03/10 px-4 py-10 text-center text-body-02 text-error-02">
            {errorMessage}
          </div>
        ) : detail ? (
          <div className="mt-8 space-y-4">
            <dl className="grid gap-3 rounded-2xl border border-border-deactivated bg-background-dark p-4 min-[480px]:grid-cols-2">
              <div>
                <dt className="text-label-06 text-text-placeholder">신고 번호</dt>
                <dd className="mt-1 text-label-04 text-text-primary">{detail.id}</dd>
              </div>
              <div>
                <dt className="text-label-06 text-text-placeholder">대상</dt>
                <dd className="mt-1 text-label-04 text-text-primary">
                  {detail.targetType} #{detail.targetId}
                </dd>
              </div>
              <div>
                <dt className="text-label-06 text-text-placeholder">신고자</dt>
                <dd className="mt-1 text-label-04 text-text-primary">
                  {detail.reporterNickname}
                </dd>
              </div>
              <div>
                <dt className="text-label-06 text-text-placeholder">현재 상태</dt>
                <dd className="mt-1 text-label-04 text-text-primary">{detail.status}</dd>
              </div>
              <div>
                <dt className="text-label-06 text-text-placeholder">접수 일시</dt>
                <dd className="mt-1 text-label-04 text-text-primary">
                  {formatDateTime(detail.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-label-06 text-text-placeholder">검토 일시</dt>
                <dd className="mt-1 text-label-04 text-text-primary">
                  {formatDateTime(detail.reviewedAt)}
                </dd>
              </div>
              <div className="min-[480px]:col-span-2">
                <dt className="text-label-06 text-text-placeholder">검토자</dt>
                <dd className="mt-1 text-label-04 text-text-primary">
                  {detail.reviewedByNickname ?? "-"}
                </dd>
              </div>
            </dl>

            <div className="rounded-2xl border border-border-deactivated bg-white p-4">
              <p className="text-label-06 text-text-placeholder">신고 내용</p>
              <p className="mt-2 whitespace-pre-wrap text-body-02 text-text-primary">
                {detail.message}
              </p>
            </div>

            <div>
              <p className="text-label-05 text-text-secondary">처리 액션</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {reviewActions.map((action) => (
                  <Button
                    key={action.status}
                    disabled={isSubmitting || detail.status === action.status}
                    onClick={() => onSelectStatus(action.status)}
                    variant={action.status === "DISMISSED" ? "secondary" : "primary"}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>,
    portalRoot,
  );
};

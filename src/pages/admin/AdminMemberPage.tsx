import { useMemo } from "react";

import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import {
  useAdminMembers,
  usePatchMemberStatus,
} from "@/apis/modules/admin-member";
import { AdminEmptyState } from "@/shared/ui/AdminEmptyState/AdminEmptyState";
import {
  AdminStatusBadge,
  type AdminStatusTone,
} from "@/shared/ui/AdminStatusBadge/AdminStatusBadge";
import { Button } from "@/shared/ui/button/Button";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import type { MemberStatus } from "@/types/admin";
import { formatDateTime } from "@/utils/formatDateTime";

const PAGE_SIZE = 10;

const statusFilters: Array<{ label: string; value?: MemberStatus }> = [
  { label: "전체", value: undefined },
  { label: "활성", value: "ACTIVE" },
  { label: "정지", value: "SUSPENDED" },
  { label: "차단", value: "BANNED" },
];

const memberStatusLabels: Record<MemberStatus, string> = {
  ACTIVE: "활성",
  BANNED: "차단",
  SUSPENDED: "정지",
};

const memberStatusTones: Record<MemberStatus, AdminStatusTone> = {
  ACTIVE: "green",
  BANNED: "red",
  SUSPENDED: "yellow",
};

const parsePage = (pageParam: string | null) => {
  const numericPage = Number(pageParam);

  if (!Number.isFinite(numericPage) || numericPage < 1) {
    return 1;
  }

  return numericPage;
};

const buildSuspendedUntilIso = (days: number) => {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
};

const AdminMemberPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parsePage(searchParams.get("page"));
  const statusParam = searchParams.get("status");
  const status = useMemo<MemberStatus | undefined>(() => {
    if (
      statusParam === "ACTIVE" ||
      statusParam === "SUSPENDED" ||
      statusParam === "BANNED"
    ) {
      return statusParam;
    }

    return undefined;
  }, [statusParam]);

  const membersQuery = useAdminMembers({
    page: currentPage - 1,
    size: PAGE_SIZE,
    status,
  });
  const patchMemberStatusMutation = usePatchMemberStatus();

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

  const handleStatusFilter = (nextStatus?: MemberStatus) => {
    updateSearchParams({
      page: "1",
      status: nextStatus ?? null,
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: String(page) });
  };

  const handleUpdateStatus = async (
    memberId: number,
    nextStatus: MemberStatus,
  ) => {
    try {
      await patchMemberStatusMutation.mutateAsync({
        memberId,
        payload: {
          status: nextStatus,
          suspendedUntil:
            nextStatus === "SUSPENDED" ? buildSuspendedUntilIso(7) : null,
        },
      });

      toast.success("회원 상태를 업데이트했습니다.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "회원 상태를 업데이트하지 못했습니다.",
      );
    }
  };

  const members = membersQuery.data?.members ?? [];
  const isEmpty = !membersQuery.isLoading && members.length === 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-head-03 text-text-primary">회원 관리</h1>
          <p className="mt-2 text-body-02 text-text-secondary">
            회원 상태를 확인하고 운영 이슈가 있는 계정을 즉시 조치할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => {
            const isActive = filter.value === status;

            return (
              <Button
                key={filter.label}
                className={isActive ? "" : "border-border-deactivated"}
                onClick={() => handleStatusFilter(filter.value)}
                variant={isActive ? "primary" : "secondary"}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {membersQuery.isError ? (
        <div className="rounded-3xl border border-error-03/30 bg-error-03/10 px-6 py-10 text-center text-body-02 text-error-02">
          {membersQuery.error instanceof Error
            ? membersQuery.error.message
            : "회원 목록을 불러오지 못했습니다."}
        </div>
      ) : isEmpty ? (
        <AdminEmptyState
          description="선택한 상태에 해당하는 회원이 없습니다."
          title="표시할 회원이 없습니다."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border-deactivated bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-background-dark">
                <tr className="text-left text-label-05 text-text-secondary">
                  <th className="px-5 py-4">닉네임</th>
                  <th className="px-5 py-4">학번</th>
                  <th className="px-5 py-4">상태</th>
                  <th className="px-5 py-4">정지 해제</th>
                  <th className="px-5 py-4">가입일</th>
                  <th className="px-5 py-4">액션</th>
                </tr>
              </thead>
              <tbody>
                {membersQuery.isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={`member-skeleton-${index}`}
                        className="border-t border-border-deactivated"
                      >
                        <td className="px-5 py-4" colSpan={6}>
                          <div className="h-5 animate-pulse rounded-full bg-gray-100" />
                        </td>
                      </tr>
                    ))
                  : members.map((member) => (
                      <tr
                        key={member.id}
                        className="border-t border-border-deactivated text-body-02 text-text-primary"
                      >
                        <td className="px-5 py-4 font-medium">{member.nickname}</td>
                        <td className="px-5 py-4">{member.studentNumber}</td>
                        <td className="px-5 py-4">
                          <AdminStatusBadge tone={memberStatusTones[member.status]}>
                            {memberStatusLabels[member.status]}
                          </AdminStatusBadge>
                        </td>
                        <td className="px-5 py-4 text-text-secondary">
                          {formatDateTime(member.suspendedUntil)}
                        </td>
                        <td className="px-5 py-4 text-text-secondary">
                          {formatDateTime(member.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              disabled={patchMemberStatusMutation.isPending}
                              onClick={() => handleUpdateStatus(member.id, "ACTIVE")}
                              variant="secondary"
                            >
                              활성화
                            </Button>
                            <Button
                              disabled={patchMemberStatusMutation.isPending}
                              onClick={() =>
                                handleUpdateStatus(member.id, "SUSPENDED")
                              }
                              variant="secondary"
                            >
                              7일 정지
                            </Button>
                            <Button
                              disabled={patchMemberStatusMutation.isPending}
                              onClick={() => handleUpdateStatus(member.id, "BANNED")}
                            >
                              차단
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {membersQuery.data && membersQuery.data.totalPages > 1 ? (
        <div>
          <div className="text-right text-caption-01 text-text-secondary">
            총 {membersQuery.data.totalElements.toLocaleString("ko-KR")}명
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={membersQuery.data.totalPages}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AdminMemberPage;

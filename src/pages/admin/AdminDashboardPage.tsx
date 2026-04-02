import {
  FileText,
  Flag,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAdminMembers } from "@/apis/modules/admin-member";
import {
  useAdminHiddenPostCount,
  useAdminPosts,
} from "@/apis/modules/admin-post";
import { useAdminReports } from "@/apis/modules/admin-report";
import { AdminQuickAction } from "@/shared/ui/AdminQuickAction/AdminQuickAction";
import { AdminStatCard } from "@/shared/ui/AdminStatCard/AdminStatCard";

const quickActions = [
  {
    description: "정지/복구가 필요한 계정을 빠르게 확인합니다.",
    title: "회원 관리 열기",
    to: "/admin/members",
  },
  {
    description: "접수된 신고를 확인하고 상태를 조정합니다.",
    title: "신고 관리 열기",
    to: "/admin/reports",
  },
  {
    description: "숨김/복원이 필요한 게시글을 점검합니다.",
    title: "게시글 관리 열기",
    to: "/admin/posts",
  },
  {
    description: "관리자 숨김 댓글과 삭제 요청을 확인합니다.",
    title: "댓글 관리 열기",
    to: "/admin/comments",
  },
];

const renderStatValue = (
  value: number | undefined,
  isLoading: boolean,
  isError: boolean,
) => {
  if (isLoading) {
    return "…";
  }

  if (isError || value === undefined) {
    return "-";
  }

  return value.toLocaleString("ko-KR");
};

const AdminDashboardPage = () => {
  const membersQuery = useAdminMembers({ page: 0, size: 1 });
  const pendingReportsQuery = useAdminReports({
    page: 0,
    size: 1,
    status: "RECEIVED",
  });
  const postsQuery = useAdminPosts({ page: 0, size: 1 });
  const hiddenPostsQuery = useAdminHiddenPostCount();

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] bg-gradient-to-br from-primary-1000 via-primary-700 to-primary-500 px-8 py-9 text-white shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-label-06">
            Comit Admin Workspace
          </span>
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-label-06 text-white/80">
            운영 전용 화면
          </span>
        </div>
        <h1 className="mt-5 text-head-02">관리자 대시보드</h1>
        <p className="mt-3 max-w-[560px] text-body-02 text-white/85">
          회원, 신고, 게시글, 댓글 운영 이슈를 한 화면에서 빠르게 확인할 수
          있도록 구성했습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-label-04 text-primary-900 transition-colors hover:bg-secondary-100"
            to="/admin/reports"
          >
            <Flag className="h-4 w-4" />
            처리 대기 신고 보기
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-label-04 text-white transition-colors hover:bg-white/10"
            to="/admin/posts"
          >
            <FileText className="h-4 w-4" />
            게시글 관리로 이동
          </Link>
        </div>
      </div>

      <div className="grid gap-4 min-[900px]:grid-cols-2 min-[1280px]:grid-cols-4">
        <AdminStatCard
          accent="blue"
          description="현재 시스템에 등록된 전체 회원 수입니다."
          icon={Users}
          title="전체 회원"
          value={renderStatValue(
            membersQuery.data?.totalElements,
            membersQuery.isLoading,
            membersQuery.isError,
          )}
        />
        <AdminStatCard
          accent="orange"
          description="지금 검토가 필요한 접수 상태 신고 건수입니다."
          icon={Flag}
          title="처리 대기 신고"
          value={renderStatValue(
            pendingReportsQuery.data?.totalElements,
            pendingReportsQuery.isLoading,
            pendingReportsQuery.isError,
          )}
        />
        <AdminStatCard
          accent="violet"
          description="관리 대상이 되는 전체 게시글 수입니다."
          icon={FileText}
          title="전체 게시글"
          value={renderStatValue(
            postsQuery.data?.totalElements,
            postsQuery.isLoading,
            postsQuery.isError,
          )}
        />
        <AdminStatCard
          accent="mint"
          description="관리자에 의해 숨김 처리된 게시글 수입니다."
          icon={LayoutDashboard}
          title="숨김 게시물"
          value={renderStatValue(
            hiddenPostsQuery.data,
            hiddenPostsQuery.isLoading,
            hiddenPostsQuery.isError,
          )}
        />
      </div>

      <div className="grid gap-6 min-[1180px]:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-border-deactivated bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-subtitle-01 text-text-primary">빠른 작업</h2>
              <p className="mt-1 text-body-02 text-text-secondary">
                운영 흐름에서 자주 여는 화면을 바로 진입할 수 있게 모았습니다.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {quickActions.map((action) => (
              <AdminQuickAction key={action.to} {...action} />
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-border-deactivated bg-white p-6 shadow-sm">
          <h2 className="text-subtitle-02 text-text-primary">운영 체크 포인트</h2>
          <ul className="mt-4 space-y-3 text-body-02 text-text-secondary">
            <li className="rounded-2xl bg-background-dark px-4 py-3">
              회원 정지 후에는 목록이 자동 갱신됩니다.
            </li>
            <li className="rounded-2xl bg-background-dark px-4 py-3">
              게시글/댓글 삭제는 확인 모달을 거친 뒤에만 진행됩니다.
            </li>
            <li className="rounded-2xl bg-background-dark px-4 py-3">
              신고 상세는 모달 안에서 바로 상태를 바꿀 수 있습니다.
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default AdminDashboardPage;

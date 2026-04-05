import { useState } from "react";

import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import {
  useAdminComments,
  useDeleteComment,
  usePatchCommentVisibility,
} from "@/apis/modules/admin-comment";
import { AdminEmptyState } from "@/shared/ui/AdminEmptyState/AdminEmptyState";
import { AdminStatusBadge } from "@/shared/ui/AdminStatusBadge/AdminStatusBadge";
import { Button } from "@/shared/ui/button/Button";
import { DeleteModal } from "@/shared/ui/DeleteModal/DeleteModal";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import { formatDateTime } from "@/utils/formatDateTime";

const PAGE_SIZE = 10;

const parsePage = (pageParam: string | null) => {
  const numericPage = Number(pageParam);
  return Number.isFinite(numericPage) && numericPage > 0 ? numericPage : 1;
};

const parsePostId = (postIdParam: string | null) => {
  const numericPostId = Number(postIdParam);
  return Number.isFinite(numericPostId) && numericPostId > 0
    ? numericPostId
    : undefined;
};

const AdminCommentPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const currentPage = parsePage(searchParams.get("page"));
  const postId = parsePostId(searchParams.get("postId"));

  const commentsQuery = useAdminComments({
    page: currentPage - 1,
    postId,
    size: PAGE_SIZE,
  });
  const deleteCommentMutation = useDeleteComment();
  const patchCommentVisibilityMutation = usePatchCommentVisibility();

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

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: String(page) });
  };

  const handlePostIdChange = (value: string) => {
    updateSearchParams({
      page: "1",
      postId: value.trim() ? value.trim() : null,
    });
  };

  const handleToggleVisibility = async (commentId: number, hidden: boolean) => {
    try {
      await patchCommentVisibilityMutation.mutateAsync({
        commentId,
        payload: { hidden },
      });
      toast.success(hidden ? "댓글을 숨겼습니다." : "댓글을 복원했습니다.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "댓글 상태를 업데이트하지 못했습니다.",
      );
    }
  };

  const handleDeleteComment = async () => {
    if (deleteTargetId === null) {
      return;
    }

    try {
      await deleteCommentMutation.mutateAsync(deleteTargetId);
      toast.success("댓글을 삭제했습니다.");
      setDeleteTargetId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "댓글을 삭제하지 못했습니다.",
      );
    }
  };

  const comments = commentsQuery.data?.comments ?? [];
  const isEmpty = !commentsQuery.isLoading && comments.length === 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-head-03 text-text-primary">댓글 관리</h1>
          <p className="mt-2 text-body-02 text-text-secondary">
            댓글 숨김·복원과 삭제를 한 화면에서 처리할 수 있습니다.
          </p>
        </div>

        <div className="rounded-2xl border border-border-deactivated bg-white px-4 py-3">
          <label
            className="text-label-06 text-text-placeholder"
            htmlFor="admin-post-id-filter"
          >
            게시글 ID 필터
          </label>
          <input
            className="mt-2 block w-[180px] rounded-xl border border-border-deactivated px-3 py-2 text-body-02 outline-none focus:border-primary-400"
            defaultValue={postId ?? ""}
            id="admin-post-id-filter"
            onBlur={(event) => handlePostIdChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handlePostIdChange(event.currentTarget.value);
              }
            }}
            placeholder="예: 12"
            type="number"
          />
        </div>
      </div>

      {commentsQuery.isError ? (
        <div className="rounded-3xl border border-error-03/30 bg-error-03/10 px-6 py-10 text-center text-body-02 text-error-02">
          {commentsQuery.error instanceof Error
            ? commentsQuery.error.message
            : "댓글 목록을 불러오지 못했습니다."}
        </div>
      ) : isEmpty ? (
        <AdminEmptyState
          description="선택한 조건에 맞는 댓글이 없습니다."
          title="표시할 댓글이 없습니다."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border-deactivated bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-background-dark">
                <tr className="text-left text-label-05 text-text-secondary">
                  <th className="px-5 py-4">댓글</th>
                  <th className="px-5 py-4">작성자</th>
                  <th className="px-5 py-4">대상 게시글</th>
                  <th className="px-5 py-4">좋아요</th>
                  <th className="px-5 py-4">상태</th>
                  <th className="px-5 py-4">작성일</th>
                  <th className="px-5 py-4">액션</th>
                </tr>
              </thead>
              <tbody>
                {commentsQuery.isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        key={`comment-skeleton-${index}`}
                        className="border-t border-border-deactivated"
                      >
                        <td className="px-5 py-4" colSpan={7}>
                          <div className="h-5 animate-pulse rounded-full bg-gray-100" />
                        </td>
                      </tr>
                    ))
                  : comments.map((comment) => (
                      <tr
                        key={comment.id}
                        className="border-t border-border-deactivated align-top text-body-02 text-text-primary"
                      >
                        <td className="max-w-[320px] px-5 py-4">
                          <div className="line-clamp-2">{comment.content}</div>
                          {comment.parentCommentId ? (
                            <p className="mt-1 text-caption-01 text-text-placeholder">
                              답글 · 부모 댓글 #{comment.parentCommentId}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-5 py-4">{comment.authorNickname}</td>
                        <td className="px-5 py-4 text-text-secondary">
                          게시글 #{comment.postId}
                        </td>
                        <td className="px-5 py-4">{comment.helpfulCount}</td>
                        <td className="px-5 py-4">
                          <AdminStatusBadge
                            tone={comment.hiddenByAdmin ? "red" : "green"}
                          >
                            {comment.hiddenByAdmin ? "숨김" : "노출 중"}
                          </AdminStatusBadge>
                        </td>
                        <td className="px-5 py-4 text-text-secondary">
                          {formatDateTime(comment.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              disabled={
                                patchCommentVisibilityMutation.isPending
                              }
                              onClick={() =>
                                handleToggleVisibility(
                                  comment.id,
                                  !comment.hiddenByAdmin,
                                )
                              }
                              variant="secondary"
                            >
                              {comment.hiddenByAdmin ? "복원" : "숨김"}
                            </Button>
                            <Button
                              disabled={deleteCommentMutation.isPending}
                              onClick={() => setDeleteTargetId(comment.id)}
                            >
                              삭제
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

      {commentsQuery.data && commentsQuery.data.totalPages > 1 ? (
        <div>
          <div className="text-right text-caption-01 text-text-secondary">
            총 {commentsQuery.data.totalElements.toLocaleString("ko-KR")}건
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={commentsQuery.data.totalPages}
            />
          </div>
        </div>
      ) : null}

      {deleteTargetId !== null ? (
        <DeleteModal
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleDeleteComment}
          target="comment"
        />
      ) : null}
    </section>
  );
};

export default AdminCommentPage;

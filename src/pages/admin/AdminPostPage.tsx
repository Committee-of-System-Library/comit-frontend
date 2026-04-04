import { useMemo, useState } from "react";

import { Eye, Heart, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import {
  useAdminPosts,
  useDeletePost,
  usePatchPostVisibility,
} from "@/apis/modules/admin-post";
import { AdminEmptyState } from "@/shared/ui/AdminEmptyState/AdminEmptyState";
import { AdminPostCard } from "@/shared/ui/AdminPostCard/AdminPostCard";
import { AdminStatusBadge } from "@/shared/ui/AdminStatusBadge/AdminStatusBadge";
import { Button } from "@/shared/ui/button/Button";
import { DeleteModal } from "@/shared/ui/DeleteModal/DeleteModal";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import type { BoardType } from "@/types/admin";
import { resolveContentPreview } from "@/utils/contentPreview";
import { formatDateTime } from "@/utils/formatDateTime";

const PAGE_SIZE = 8;

const boardFilters: Array<{ label: string; value?: BoardType }> = [
  { label: "전체", value: undefined },
  { label: "Q&A", value: "QNA" },
  { label: "자유", value: "FREE" },
];

const boardLabels: Record<BoardType, string> = {
  FREE: "자유",
  QNA: "Q&A",
};

const parsePage = (pageParam: string | null) => {
  const numericPage = Number(pageParam);
  return Number.isFinite(numericPage) && numericPage > 0 ? numericPage : 1;
};

const AdminPostPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const currentPage = parsePage(searchParams.get("page"));
  const boardTypeParam = searchParams.get("boardType");
  const boardType = useMemo<BoardType | undefined>(() => {
    if (boardTypeParam === "FREE" || boardTypeParam === "QNA") {
      return boardTypeParam;
    }

    return undefined;
  }, [boardTypeParam]);

  const postsQuery = useAdminPosts({
    boardType,
    page: currentPage - 1,
    size: PAGE_SIZE,
  });
  const deletePostMutation = useDeletePost();
  const patchPostVisibilityMutation = usePatchPostVisibility();

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

  const handleBoardFilter = (nextBoardType?: BoardType) => {
    updateSearchParams({
      boardType: nextBoardType ?? null,
      page: "1",
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: String(page) });
  };

  const handleToggleVisibility = async (postId: number, hidden: boolean) => {
    try {
      await patchPostVisibilityMutation.mutateAsync({
        postId,
        payload: { hidden },
      });
      toast.success(hidden ? "게시글을 숨겼습니다." : "게시글을 복원했습니다.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "게시글 상태를 업데이트하지 못했습니다.",
      );
    }
  };

  const handleDeletePost = async () => {
    if (deleteTargetId === null) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(deleteTargetId);
      toast.success("게시글을 삭제했습니다.");
      setDeleteTargetId(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "게시글을 삭제하지 못했습니다.",
      );
    }
  };

  const posts = postsQuery.data?.posts ?? [];
  const isEmpty = !postsQuery.isLoading && posts.length === 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-head-03 text-text-primary">게시글 관리</h1>
          <p className="mt-2 text-body-02 text-text-secondary">
            관리자 숨김과 삭제가 필요한 게시글을 게시판별로 확인할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {boardFilters.map((filter) => {
            const isActive = filter.value === boardType;

            return (
              <Button
                key={filter.label}
                onClick={() => handleBoardFilter(filter.value)}
                variant={isActive ? "primary" : "secondary"}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {postsQuery.isError ? (
        <div className="rounded-3xl border border-error-03/30 bg-error-03/10 px-6 py-10 text-center text-body-02 text-error-02">
          {postsQuery.error instanceof Error
            ? postsQuery.error.message
            : "게시글 목록을 불러오지 못했습니다."}
        </div>
      ) : isEmpty ? (
        <AdminEmptyState
          description="선택한 조건에 맞는 게시글이 없습니다."
          title="표시할 게시글이 없습니다."
        />
      ) : (
        <div className="space-y-4">
          {postsQuery.isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`post-skeleton-${index}`}
                  className="h-40 animate-pulse rounded-3xl border border-border-deactivated bg-white"
                />
              ))
            : posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-border-deactivated bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminStatusBadge tone="blue">
                      {boardLabels[post.boardType]}
                    </AdminStatusBadge>
                    <AdminStatusBadge
                      tone={post.hiddenByAdmin ? "red" : "green"}
                    >
                      {post.hiddenByAdmin ? "숨김" : "노출 중"}
                    </AdminStatusBadge>
                    <span className="text-caption-01 text-text-secondary">
                      작성일 {formatDateTime(post.createdAt)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <AdminPostCard
                      content={resolveContentPreview(post.contentPreview)}
                      createdAt={post.createdAt}
                      metaItems={[
                        {
                          icon: UserRound,
                          value: post.authorNickname,
                        },
                        {
                          icon: Heart,
                          value: post.likeCount,
                        },
                        {
                          icon: Eye,
                          value: post.viewCount,
                        },
                      ]}
                      title={post.title}
                      user={post.authorNickname}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      disabled={patchPostVisibilityMutation.isPending}
                      onClick={() =>
                        handleToggleVisibility(post.id, !post.hiddenByAdmin)
                      }
                      variant="secondary"
                    >
                      {post.hiddenByAdmin ? "복원" : "숨김"}
                    </Button>
                    <Button
                      disabled={deletePostMutation.isPending}
                      onClick={() => setDeleteTargetId(post.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </article>
              ))}
        </div>
      )}

      {postsQuery.data && postsQuery.data.totalPages > 1 ? (
        <div>
          <div className="text-right text-caption-01 text-text-secondary">
            총 {postsQuery.data.totalElements.toLocaleString("ko-KR")}건
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              totalPages={postsQuery.data.totalPages}
            />
          </div>
        </div>
      ) : null}

      {deleteTargetId !== null ? (
        <DeleteModal
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleDeletePost}
          target="post"
        />
      ) : null}
    </section>
  );
};

export default AdminPostPage;

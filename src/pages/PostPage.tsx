import { useState, useMemo } from "react";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import type { BoardType } from "@/entities/post/model/types";
import { useCommentsQuery } from "@/features/comment/model/useCommentsQuery";
import { useCreateCommentMutation } from "@/features/comment/model/useCreateCommentMutation";
import { useDeleteCommentMutation } from "@/features/comment/model/useDeleteCommentMutation";
import { useMyProfileQuery } from "@/features/member/model/useMyProfileQuery";
import { normalizePostDomainError } from "@/features/post/model/postDomainError";
import { resolvePostDomainErrorMessage } from "@/features/post/model/postDomainErrorMessage";
import { mapPostDetailToPost } from "@/features/post/model/postUiMappers";
import { useDeletePostMutation } from "@/features/post/model/useDeletePostMutation";
import { usePostDetailQuery } from "@/features/post/model/usePostDetailQuery";
import { useTogglePostLikeMutation } from "@/features/post/model/useTogglePostLikeMutation";
import { buildPostShareUrl } from "@/shared/lib/share-url";
import { CommentGroup } from "@/shared/ui/CommentGroup/CommentGroup";
import { CommentInput } from "@/shared/ui/CommentInput/CommentInput";
import { DeleteModal } from "@/shared/ui/DeleteModal/DeleteModal";
import { PostDetailCard } from "@/shared/ui/PostDetailCard/PostDetailCard";
import { ReportModal } from "@/shared/ui/ReportModal/ReportModal";

const PostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const parsedPostId = Number(postId);
  const isValidPostId = Number.isInteger(parsedPostId) && parsedPostId > 0;

  // -- 댓글 모달 상태 --
  const [reportTarget, setReportTarget] = useState<{
    id: number;
    name: string;
    content: string;
    type: "comment" | "post";
  } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);

  // -- API Queries & Mutations --
  const { data: myProfile } = useMyProfileQuery();

  const {
    data: postData,
    error: detailError,
    isError: isPostError,
    isLoading: isPostLoading,
  } = usePostDetailQuery({
    postId: parsedPostId,
    enabled: isValidPostId,
  });

  const togglePostLikeMutation = useTogglePostLikeMutation();
  const deletePostMutation = useDeletePostMutation();

  const { data: commentsData, isLoading: isCommentsLoading } = useCommentsQuery(
    {
      postId: parsedPostId,
    },
  );

  const comments = commentsData?.comments ?? [];
  const { mutate: createComment, isPending: isCreating } =
    useCreateCommentMutation();
  const { mutate: deleteComment } = useDeleteCommentMutation();

  // -- 데이터 가공 (Memos) --
  const mappedPost = useMemo(() => {
    if (!postData) {
      return null;
    }
    const isMine =
      !!myProfile && myProfile.nickname === postData.authorNickname;
    return { ...mapPostDetailToPost(postData), isMine };
  }, [postData, myProfile]);

  const uiComments = comments.map((item) => ({
    id: String(item.id),
    content: item.content,
    createdAt: item.createdAt,
    name: item.authorNickname,
    isMine: item.mine,
    variant: "base" as const,
    isEdited: item.updatedAt !== null,
    replies:
      item.replies?.map((reply) => ({
        id: String(reply.id),
        content: reply.content,
        createdAt: reply.createdAt,
        name: reply.authorNickname,
        isMine: reply.mine,
        variant: "reply" as const,
        isEdited: reply.updatedAt !== null,
      })) || [],
  }));

  // -- 이벤트 핸들러 --
  const handleTogglePostLike = async () => {
    try {
      await togglePostLikeMutation.mutateAsync(parsedPostId);
    } catch (error) {
      toast.error(
        resolvePostDomainErrorMessage(error, {
          auth: "로그인 후 좋아요를 누를 수 있어요.",
          default: "좋아요 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
          forbidden: "이 게시글에는 좋아요를 누를 수 없어요.",
          notFound: "이미 삭제되었거나 존재하지 않는 게시글이에요.",
        }),
      );
    }
  };

  const handleCommentSubmit = (value: string) => {
    createComment({
      postId: parsedPostId,
      payload: { content: value },
    });
  };

  const resolveBoardPath = (boardType: BoardType) => {
    switch (boardType) {
      case "QNA":
        return "/board/qna";
      case "INFO":
        return "/board/info";
      case "FREE":
        return "/board/free";
      case "NOTICE":
        return "/notice";
      case "EVENT":
        return "/event";
      default:
        return "/";
    }
  };

  const handlePostDeleteConfirm = async () => {
    try {
      await deletePostMutation.mutateAsync(parsedPostId);
      toast.success("게시글이 삭제되었습니다.");
      setIsPostDeleteModalOpen(false);
      navigate(resolveBoardPath(postData.boardType), { replace: true });
    } catch (error) {
      toast.error(
        resolvePostDomainErrorMessage(error, {
          auth: "로그인 후 게시글을 삭제할 수 있어요.",
          default: "게시글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
          forbidden: "해당 게시글을 삭제할 권한이 없습니다.",
          notFound: "이미 삭제되었거나 존재하지 않는 게시글이에요.",
        }),
      );
    }
  };

  // -- 예외 및 로딩 처리 (Early Returns) --
  const resolvedDetailError = isPostError
    ? normalizePostDomainError(detailError)
    : null;

  if (!isValidPostId) {
    return (
      <main className="flex w-full max-w-223.5 flex-col items-center gap-8 pb-10">
        <div className="w-full rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-error-03">
          유효하지 않은 게시글 경로입니다.
        </div>
      </main>
    );
  }

  if (isPostLoading) {
    return (
      <main className="flex w-full max-w-223.5 flex-col items-center gap-8 pb-10">
        <div className="w-full rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-text-tertiary">
          게시글을 불러오는 중입니다.
        </div>
      </main>
    );
  }

  if (isPostError || !mappedPost) {
    const detailErrorMessage = resolvePostDomainErrorMessage(
      resolvedDetailError,
      {
        auth: "로그인 후 게시글을 확인할 수 있어요.",
        default: "게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        forbidden: "이 게시글을 볼 권한이 없습니다.",
        notFound: "게시글을 찾을 수 없습니다.",
      },
    );

    return (
      <main className="flex w-full max-w-223.5 flex-col items-center gap-8 pb-10">
        <div className="w-full rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-error-03">
          {detailErrorMessage}
        </div>
      </main>
    );
  }

  // -- 메인 렌더링 --
  return (
    <main className="min-w-163.5 max-w-223.5 flex flex-col items-center pb-10 gap-8">
      <PostDetailCard
        {...mappedPost}
        image={mappedPost.image ?? []}
        isMine={mappedPost.isMine}
        isLikePending={togglePostLikeMutation.isPending}
        onEdit={() => navigate(`/write?postId=${parsedPostId}`)}
        onDelete={() => setIsPostDeleteModalOpen(true)}
        onReport={() =>
          setReportTarget({
            id: parsedPostId,
            name: mappedPost.user,
            content: mappedPost.content,
            type: "post",
          })
        }
        onLikeClick={handleTogglePostLike}
        shareUrl={buildPostShareUrl(parsedPostId)}
        tag={mappedPost.tag ?? []}
      />
      <div className="w-full flex flex-col gap-4">
        <CommentInput onSubmit={handleCommentSubmit} disabled={isCreating} />
        <div className="flex gap-2 items-center">
          <p className="text-subtitle-02 text-text-tertiary pl-3">댓글</p>
          <p className="text-subtitle-02 text-text-placeholder">
            {comments.length}
          </p>
        </div>

        <div className="flex flex-col border border-border-deactivated rounded-xl overflow-hidden">
          {isCommentsLoading ? (
            <div className="p-8 text-center text-text-secondary">
              댓글을 불러오는 중입니다...
            </div>
          ) : comments.length === 0 ? (
            <div className="p-8 text-center text-text-secondary bg-white">
              아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
            </div>
          ) : (
            uiComments.map((item) => (
              <CommentGroup
                key={item.id}
                comment={item}
                postId={parsedPostId}
                onReport={(id, name, content) =>
                  setReportTarget({ id, name, content, type: "comment" })
                }
                onDelete={(id) => setDeleteTargetId(Number(id))}
              />
            ))
          )}
        </div>
      </div>

      {/* 모달 렌더링 */}
      {reportTarget && (
        <ReportModal
          user={reportTarget.name}
          contents={reportTarget.content}
          target={{ type: reportTarget.type, id: reportTarget.id }}
          onClose={() => setReportTarget(null)}
        />
      )}

      {deleteTargetId !== null && (
        <DeleteModal
          target="comment"
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => {
            deleteComment(
              { commentId: deleteTargetId, postId: parsedPostId },
              {
                onSuccess: () => {
                  setDeleteTargetId(null);
                },
              },
            );
          }}
        />
      )}

      {isPostDeleteModalOpen && (
        <DeleteModal
          target="post"
          onClose={() => setIsPostDeleteModalOpen(false)}
          onConfirm={handlePostDeleteConfirm}
        />
      )}
    </main>
  );
};

export default PostPage;

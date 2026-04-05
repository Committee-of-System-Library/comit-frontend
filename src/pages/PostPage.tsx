import { useMemo } from "react";

import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { normalizePostDomainError } from "@/features/post/model/postDomainError";
import { resolvePostDomainErrorMessage } from "@/features/post/model/postDomainErrorMessage";
import { mapPostDetailToPost } from "@/features/post/model/postUiMappers";
import { usePostDetailQuery } from "@/features/post/model/usePostDetailQuery";
import { useTogglePostLikeMutation } from "@/features/post/model/useTogglePostLikeMutation";
import { MOCK_COMMENTS } from "@/mocks/detailPost";
import { buildPostShareUrl } from "@/shared/lib/share-url";
import { CommentGroup } from "@/shared/ui/CommentGroup/CommentGroup";
import { CommentInput } from "@/shared/ui/CommentInput/CommentInput";
import { PostDetailCard } from "@/shared/ui/PostDetailCard/PostDetailCard";

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const parsedPostId = Number(postId);
  const isValidPostId = Number.isInteger(parsedPostId) && parsedPostId > 0;
  const {
    data,
    error: detailError,
    isError,
    isLoading,
  } = usePostDetailQuery({
    postId: parsedPostId,
    enabled: isValidPostId,
  });
  const togglePostLikeMutation = useTogglePostLikeMutation();

  const mappedPost = useMemo(() => {
    if (!data) {
      return null;
    }

    return mapPostDetailToPost(data);
  }, [data]);

  // 💡 댓글 등록 핸들러 (API 연동 전 테스트용)
  const handleCommentSubmit = (value: string) => {
    console.info("새 댓글 등록:", value);
  };

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

  const resolvedDetailError = isError
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

  if (isLoading) {
    return (
      <main className="flex w-full max-w-223.5 flex-col items-center gap-8 pb-10">
        <div className="w-full rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-text-tertiary">
          게시글을 불러오는 중입니다.
        </div>
      </main>
    );
  }

  if (isError || !mappedPost) {
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

  return (
    <main className="min-w-163.5 max-w-223.5 flex flex-col items-center pb-10 gap-8">
      <PostDetailCard
        {...mappedPost}
        image={mappedPost.image ?? []}
        isLikePending={togglePostLikeMutation.isPending}
        onLikeClick={handleTogglePostLike}
        shareUrl={buildPostShareUrl(parsedPostId)}
        tag={mappedPost.tag ?? []}
      />
      <div className="w-full flex flex-col gap-4">
        <CommentInput onSubmit={handleCommentSubmit} />
        <div className="flex gap-2 items-center">
          <p className="text-subtitle-02 text-text-tertiary pl-3">댓글</p>
          <p className="text-subtitle-03 text-text-placeholder">
            {MOCK_COMMENTS.length}
          </p>
        </div>

        <div className="flex flex-col border border-border-deactivated rounded-xl overflow-hidden">
          {MOCK_COMMENTS.map((item) => (
            <CommentGroup key={item.id} comment={item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PostPage;

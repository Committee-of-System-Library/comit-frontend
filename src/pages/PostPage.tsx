import { useMemo } from "react";

import { useParams } from "react-router-dom";

import { mapPostDetailToPost } from "@/features/post/model/postUiMappers";
import { usePostDetailQuery } from "@/features/post/model/usePostDetailQuery";
import { MOCK_COMMENTS } from "@/mocks/detailPost";
import { CommentGroup } from "@/shared/ui/CommentGroup/CommentGroup";
import { CommentInput } from "@/shared/ui/CommentInput/CommentInput";
import { PostDetailCard } from "@/shared/ui/PostDetailCard/PostDetailCard";

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const parsedPostId = Number(postId);
  const isValidPostId = Number.isInteger(parsedPostId) && parsedPostId > 0;
  const { data, isError, isLoading } = usePostDetailQuery({
    postId: parsedPostId,
    enabled: isValidPostId,
  });

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
    return (
      <main className="flex w-full max-w-223.5 flex-col items-center gap-8 pb-10">
        <div className="w-full rounded-xl border border-border-deactivated bg-background-light px-4 py-10 text-center text-body-02 text-error-03">
          게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-163.5 max-w-223.5 flex flex-col items-center pb-10 gap-8">
      <PostDetailCard
        {...mappedPost}
        image={mappedPost.image ?? []}
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

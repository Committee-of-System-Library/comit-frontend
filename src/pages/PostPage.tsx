import { MOCK_POST_DATA, MOCK_COMMENTS } from "@/mocks/detailPost";
import { CommentGroup } from "@/shared/ui/CommentGroup/CommentGroup";
import { CommentInput } from "@/shared/ui/CommentInput/CommentInput";
import { PostDetailCard } from "@/shared/ui/PostDetailCard/PostDetailCard";

const PostPage = () => {
  // 💡 댓글 등록 핸들러 (API 연동 전 테스트용)
  const handleCommentSubmit = (value: string) => {
    console.info("새 댓글 등록:", value);
  };

  return (
    <main className="min-w-163.5 max-w-223.5 flex flex-col items-center pb-10 gap-8">
      <PostDetailCard
        {...MOCK_POST_DATA}
        image={MOCK_POST_DATA.image ?? []}
        tag={MOCK_POST_DATA.tag ?? []}
      />
      <div className="w-full flex flex-col gap-4">
        <CommentInput onSubmit={handleCommentSubmit} />
        <div className="flex gap-2 items-center">
          <p className="text-subtitle-02 text-text-tertiary pl-3">댓글</p>
          <p className="text-subtitle-03 text-text-placeholder">
            {MOCK_POST_DATA.comment}
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

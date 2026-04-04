import { useState } from "react";

import { useParams } from "react-router-dom";

import { useCommentsQuery } from "@/features/comment/model/useCommentsQuery";
import { useCreateCommentMutation } from "@/features/comment/model/useCreateCommentMutation";
import { MOCK_POST_DATA } from "@/mocks/detailPost";
import { CommentGroup } from "@/shared/ui/CommentGroup/CommentGroup";
import { CommentInput } from "@/shared/ui/CommentInput/CommentInput";
import { PostDetailCard } from "@/shared/ui/PostDetailCard/PostDetailCard";
import { ReportModal } from "@/shared/ui/ReportModal/ReportModal";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentPostId = Number(id) || 1;

  const [reportTarget, setReportTarget] = useState<{
    id: number;
    name: string;
    content: string;
  } | null>(null);

  const { data, isLoading } = useCommentsQuery({ postId: currentPostId });

  const comments = data?.comments ?? [];

  const { mutate: createComment, isPending: isCreating } =
    useCreateCommentMutation();

  const handleCommentSubmit = (value: string) => {
    createComment({
      postId: currentPostId,
      payload: { content: value },
    });
  };

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
        variant: "reply" as const, // 대댓글 스타일 지정
        isEdited: reply.updatedAt !== null,
      })) || [],
  }));

  return (
    <main className="min-w-163.5 max-w-223.5 flex flex-col items-center pb-10 gap-8">
      <PostDetailCard
        {...MOCK_POST_DATA}
        image={MOCK_POST_DATA.image ?? []}
        tag={MOCK_POST_DATA.tag ?? []}
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
          {isLoading ? (
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
                postId={currentPostId}
                onReport={(id, name, content) =>
                  setReportTarget({ id, name, content })
                }
              />
            ))
          )}
        </div>
      </div>
      {reportTarget && (
        <ReportModal
          user={reportTarget.name}
          contents={reportTarget.content}
          commentId={reportTarget.id}
          onClose={() => setReportTarget(null)}
        />
      )}
    </main>
  );
};

export default PostPage;

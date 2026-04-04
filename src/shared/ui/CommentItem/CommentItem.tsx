import { useState } from "react";

import { Reply } from "lucide-react";

import { useCreateCommentMutation } from "@/features/comment/model/useCreateCommentMutation";
import { useDeleteCommentMutation } from "@/features/comment/model/useDeleteCommentMutation";
import { useEditCommentMutation } from "@/features/comment/model/useEditCommentMutation";
import { CommentEditor } from "@/shared/ui/CommentEditor/CommentEditor";
import { DetailButton } from "@/shared/ui/DetailButton/DetailButton";
import { OptionList } from "@/shared/ui/OptionList/OptionList";
import { type CommentData, type CommentVariant } from "@/types/comment";
import { cn } from "@/utils/cn";
import { formatTimeAgo } from "@/utils/formatTime";

interface CommentItemProps extends Omit<CommentData, "replies"> {
  postId: number;
  onReport: (id: number, name: string, content: string) => void;
}

const baseClass =
  "group min-h-18 h-auto w-full px-4 bg-white hover:bg-background-dark transition-colors duration-200";

const variantClassMap: Record<CommentVariant, string> = {
  base: "py-4 flex justify-between",
  deleted: "min-h-0 text-text-secondary text-label-04 items-center py-4",
  reply: "py-4 flex",
  deletedReply:
    "min-h-0 py-4 items-center text-text-secondary text-label-04 flex",
};

const ReplyIcon = () => (
  <div className="mr-2 mt-1 shrink-0">
    <Reply
      size={24}
      className="scale-[-1] text-border-default"
      aria-hidden="true"
    />
  </div>
);

export const CommentItem = ({
  id,
  postId,
  variant,
  content,
  createdAt,
  isMine,
  isEdited = false,
  name,
  profileImageUrl,
  onReport,
}: CommentItemProps) => {
  type EditorMode = "none" | "edit" | "reply";
  const [editorMode, setEditorMode] = useState<EditorMode>("none");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { mutate: createReply } = useCreateCommentMutation();
  const { mutate: editComment, isPending: isEditing } =
    useEditCommentMutation();
  const { mutate: deleteComment } = useDeleteCommentMutation();

  if (variant === "deleted" || variant === "deletedReply") {
    return (
      <div className={cn(baseClass, variantClassMap[variant])}>
        {variant === "deletedReply" && <ReplyIcon />}
        <p className="text-label-04 text-text-secondary">삭제된 댓글입니다</p>
      </div>
    );
  }

  const renderContent = () => {
    if (editorMode === "edit") {
      return (
        <div className="mt-2 w-full">
          <CommentEditor
            mode="edit"
            originContent={content}
            disabled={isEditing}
            onCancel={() => setEditorMode("none")}
            onEdit={(newContent) => {
              editComment(
                {
                  commentId: Number(id),
                  postId: postId,
                  payload: { content: newContent },
                },
                {
                  onSuccess: () => {
                    setEditorMode("none");
                  },
                },
              );
            }}
          />
        </div>
      );
    }

    if (editorMode === "reply") {
      return (
        <>
          <p className="mt-2 text-text-primary text-label-04 whitespace-pre-wrap">
            {content}
          </p>
          <div className="mt-3 w-full">
            <CommentEditor
              mode="reply"
              onCancel={() => setEditorMode("none")}
              onReply={(replyContent) => {
                createReply(
                  {
                    postId: postId,
                    payload: {
                      content: replyContent,
                      parentCommentId: Number(id),
                    },
                  },
                  {
                    onSuccess: () => setEditorMode("none"),
                  },
                );
              }}
            />
          </div>
        </>
      );
    }

    return (
      <p className="mt-2 text-text-primary text-label-04 whitespace-pre-wrap">
        {content}
      </p>
    );
  };

  return (
    <div className={cn(baseClass, variantClassMap[variant])}>
      {variant === "reply" && <ReplyIcon />}

      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={`${name}의 프로필`}
                className="w-8 h-8 rounded-full bg-gray-100 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
            <div className="flex items-baseline gap-2 text-text-secondary">
              <span className="text-label-03">{name}</span>
              <span className="text-caption-02">
                {formatTimeAgo(createdAt)}
                {isEdited && " · 수정됨"}
              </span>
            </div>
          </div>

          <div className="relative">
            <DetailButton onClick={() => setIsMenuOpen(!isMenuOpen)} />
            {isMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1">
                <OptionList
                  mode={isMine ? "myComment" : "others"}
                  onEdit={() => {
                    setEditorMode("edit");
                    setIsMenuOpen(false);
                  }}
                  onDelete={() => {
                    deleteComment({
                      commentId: Number(id),
                      postId: postId,
                    });
                    setIsMenuOpen(false);
                  }}
                  onReport={() => {
                    onReport(Number(id), name, content);
                    setIsMenuOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {renderContent()}

        {variant === "base" && editorMode === "none" && (
          <button
            onClick={() => setEditorMode("reply")}
            className="mt-2 w-fit text-caption-02 text-text-tertiary hover:text-text-primary text-left transition-colors duration-200"
          >
            답글 달기
          </button>
        )}
      </div>
    </div>
  );
};

import { CommentItem } from "@/shared/ui/CommentItem/CommentItem";
import { type CommentData } from "@/types/comment";

interface CommentGroupProps {
  comment: CommentData;
  postId: number;
  isFirstGroup?: boolean;
  isLastGroup?: boolean;
  onReport: (id: number, name: string, content: string) => void;
  onDelete: (id: number) => void;
}

export const CommentGroup = ({
  comment,
  postId,
  isFirstGroup,
  isLastGroup,
  onReport,
  onDelete,
}: CommentGroupProps) => {
  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;
  return (
    <div className="flex flex-col w-full border-b border-border-deactivated last:border-none">
      <CommentItem
        {...comment}
        postId={postId}
        isFirstItem={isFirstGroup}
        isLastItem={isLastGroup && !hasReplies}
        onReport={onReport}
        onDelete={onDelete}
      />

      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col">
          {replies.map((reply: CommentData, index: number) => (
            <CommentItem
              key={reply.id}
              {...reply}
              postId={postId}
              isLastItem={isLastGroup && index === replies.length - 1}
              onReport={onReport}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

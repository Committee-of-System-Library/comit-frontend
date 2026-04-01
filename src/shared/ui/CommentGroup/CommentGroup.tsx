import { CommentItem } from "@/shared/ui/CommentItem/CommentItem";
import { type CommentData } from "@/types/comment";

interface CommentGroupProps {
  comment: CommentData;
  onReplySubmit?: (parentId: string, content: string) => void;
  onEditSubmit?: (commentId: string, content: string) => void;
}

export const CommentGroup = ({
  comment,
  onReplySubmit,
  onEditSubmit,
}: CommentGroupProps) => {
  return (
    <div className="flex flex-col w-full border-b border-border-deactivated last:border-none">
      <CommentItem
        {...comment}
        onReplySubmit={(content) => onReplySubmit?.(comment.id, content)}
        onEditSubmit={(content) => onEditSubmit?.(comment.id, content)}
      />

      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col">
          {comment.replies.map((reply: CommentData) => (
            <CommentItem
              key={reply.id}
              {...reply}
              onEditSubmit={(content) => onEditSubmit?.(reply.id, content)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

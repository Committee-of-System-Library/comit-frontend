import { CommentItem } from "@/shared/ui/CommentItem/CommentItem";
import { type CommentData } from "@/types/comment";

interface CommentGroupProps {
  comment: CommentData;
  postId: number;
  onReport: (id: number, name: string, content: string) => void;
}

export const CommentGroup = ({
  comment,
  postId,
  onReport,
}: CommentGroupProps) => {
  return (
    <div className="flex flex-col w-full border-b border-border-deactivated last:border-none">
      <CommentItem {...comment} postId={postId} onReport={onReport} />

      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col">
          {comment.replies.map((reply: CommentData) => (
            <CommentItem
              key={reply.id}
              {...reply}
              postId={postId}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};

import { UserRound, Heart, MessageCircleMore } from "lucide-react";

import type { Post } from "@/types/post";
import { formatTimeAgo } from "@/utils/formatTime";

interface AdminPostCardProps extends Post {
  disabled?: boolean;
  onClick?: () => void;
}

export const AdminPostCard = ({
  title,
  content,
  user,
  heart,
  comment,
  createdAt,
  disabled = false,
}: AdminPostCardProps) => {
  return (
    <article
      className={`w-full px-4 py-3.5 flex items-start justify-between rounded-xl border border-border-deactivated bg-background-light hover:bg-background-dark transition-colors duration-200 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex flex-1 flex-col gap-2 overflow-hidden pr-4">
        <div className="flex flex-col gap-1">
          <header className="text-subtitle-03 text-text-primary line-clamp-1">
            {title}
          </header>
          <p className="text-body-02 text-text-tertiary line-clamp-2">
            {content}
          </p>
        </div>
        <div className="flex gap-2 text-text-placeholder text-caption-02">
          <div className="flex items-center gap-1">
            <UserRound className="w-4 h-4" />
            {user}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {heart}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleMore className="w-4 h-4" />
            {comment}
          </div>
        </div>
      </div>
      <p className="text-caption-02 text-text-placeholder shrink-0">
        {formatTimeAgo(createdAt)}
      </p>
    </article>
  );
};

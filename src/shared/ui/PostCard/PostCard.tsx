import { Heart, MessageCircleMore } from "lucide-react";

import type { Post } from "@/types/post";
import { formatTimeAgo } from "@/utils/formatTime";

interface PostCardProps extends Post {
  userImage?: string;
  postImage?: string[];
  tags?: string[];
  disabled?: boolean;
  onClick?: () => void;
}

export const PostCard = ({
  title,
  content,
  user,
  heart,
  comment,
  createdAt,
  userImage,
  postImage = [],
  tags = [],
  disabled = false,
}: PostCardProps) => {
  return (
    <article
      className={`w-full px-4 py-3.5 flex items-start justify-between rounded-xl border border-border-deactivated bg-background-light hover:bg-background-dark transition-colors duration-200 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex flex-1 flex-col gap-2 overflow-hidden pr-4">
        <div className="flex gap-2">
          <div className="w-6 h-6 flex rounded-full shrink-0 bg-gray-200 overflow-hidden">
            {userImage && (
              <img
                src={userImage}
                alt={user}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="text-label-03 text-text-secondary">{user}</p>
        </div>
        <div className="flex flex-col gap-1">
          <header className="text-subtitle-03 text-text-primary line-clamp-1">
            {title}
          </header>
          <p className="text-body-02 text-text-tertiary line-clamp-2">
            {content}
          </p>
        </div>
        {postImage.length > 0 && (
          <div className="relative flex items-center w-full overflow-hidden my-2">
            <div className="flex gap-2 overflow-hidden whitespace-nowrap pr-10">
              {postImage.map((img) => (
                <div
                  key={img}
                  className="w-30 h-30 shrink-0 rounded-lg bg-gray-100 overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`post-${img}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-14 bg-linear-to-l from-background-light to-transparent pointer-events-none" />
          </div>
        )}
        {tags.length > 0 && (
          <div className="relative flex items-center w-full overflow-hidden mb-1">
            <div className="flex gap-2 overflow-hidden whitespace-nowrap pr-8">
              {tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="px-1.5 py-0.5 rounded-md bg-gray-50 text-caption-02 text-text-tertiary shrink-0"
                >
                  # {tag}
                </span>
              ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-12 bg-linear-to-l from-background-light to-transparent pointer-events-none" />
          </div>
        )}
        <div className="flex gap-2 text-text-placeholder text-caption-02">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span className="leading-none">{heart}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleMore className="w-4 h-4" />
            <span className="leading-none">{comment}</span>
          </div>
        </div>
      </div>
      <p className="text-caption-02 text-text-placeholder shrink-0">
        {formatTimeAgo(createdAt)}
      </p>
    </article>
  );
};

import type { HTMLAttributes } from "react";

import commentIcon from "@/assets/comment.svg";
import heartIcon from "@/assets/heart.svg";
import userIcon from "@/assets/user.svg";

interface PostPreviewItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  content: string;
  author: string;
  likes: number | string;
  comments: number | string;
  time: string;
  imageUrl?: string;
}

export const PostPreviewItem = ({
  title,
  content,
  author,
  likes,
  comments,
  time,
  imageUrl,
  className = "",
  ...props
}: PostPreviewItemProps) => {
  return (
    <div
      className={`flex w-full max-w-[894px] items-start justify-between border border-border-deactivated bg-white px-4 py-[14px] transition-colors hover:bg-gray-50 cursor-pointer ${className}`}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-[9px] min-w-0">
        <div className="flex flex-col gap-1 min-w-0 overflow-hidden">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[16px] text-text-primary! font-bold leading-[1.2]">
            {title}
          </p>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] text-text-secondary! font-normal leading-[1.6]">
            {content}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2 h-4.25 w-full min-w-0">
          <div className="flex flex-row items-center gap-1 shrink-0">
            <img src={userIcon} alt="user" className="size-4 shrink-0" />
            <span className="text-[12px]! font-normal text-text-secondary! leading-[1.4] whitespace-nowrap">
              {author}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2 min-w-0">
            <div className="flex flex-row items-center gap-0.5 shrink-0">
              <img src={heartIcon} alt="heart" className="size-4 shrink-0" />
              <span className="text-[12px]! font-normal text-text-secondary! leading-[1.4] whitespace-nowrap">
                {likes}
              </span>
            </div>
            <div className="flex flex-row items-center gap-0.5 shrink-0">
              <img
                src={commentIcon}
                alt="comment"
                className="size-4 shrink-0"
              />
              <span className="text-[12px]! font-normal text-text-secondary! leading-[1.4] whitespace-nowrap">
                {comments}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full items-end justify-between shrink-0 ml-4">
        <div className="flex items-center justify-end pl-1">
          <span className="text-right text-[12px]! font-normal text-text-secondary! leading-[1.4] whitespace-nowrap w-14.5 block">
            {time}
          </span>
        </div>
        {imageUrl && (
          <div className="size-12 overflow-hidden rounded-lg shrink-0 mt-2">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

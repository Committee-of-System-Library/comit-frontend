import type { HTMLAttributes } from "react";

import commentIcon from "@/assets/comment.svg";
import heartIcon from "@/assets/heart.svg";
import userIcon from "@/assets/user.svg";

interface PostItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  content: string;
  author: string;
  likes: number | string;
  comments: number | string;
  time: string;
  imageUrl?: string;
}

export const PostItem = ({
  title,
  content,
  author,
  likes,
  comments,
  time,
  imageUrl,
  className = "",
  ...props
}: PostItemProps) => {
  return (
    <div
      className={`flex h-25.75 w-223.5 items-start justify-between border-b border-border-deactivated bg-white px-4 py-3.5 transition-colors hover:bg-gray-100 cursor-pointer ${className}`}
      {...props}
    >
      <div className="flex flex-1 flex-col justify-between h-full min-w-0">
        <div className="flex flex-col gap-1 pt-1 min-w-0">
          <p className="truncate text-[16px] font-bold text-gray-900! leading-[1.2]">
            {title}
          </p>
          <p className="truncate text-[14px] font-normal text-gray-600! leading-[1.6]">
            {content}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2 h-4.25">
          <div className="flex flex-row items-center gap-1">
            <img src={userIcon} alt="user" className="size-4 shrink-0" />
            <span className="text-[12px] font-normal text-gray-600! leading-[1.4] whitespace-nowrap">
              {author}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center gap-0.5">
              <img src={heartIcon} alt="heart" className="size-4 shrink-0" />
              <span className="text-[12px] font-normal text-gray-600! leading-[1.4] whitespace-nowrap">
                {likes}
              </span>
            </div>
            <div className="flex flex-row items-center gap-0.5">
              <img
                src={commentIcon}
                alt="comment"
                className="size-4 shrink-0"
              />
              <span className="text-[12px] font-normal text-gray-600! leading-[1.4] whitespace-nowrap">
                {comments}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full items-end justify-between shrink-0 ml-4">
        <div className="flex items-center justify-end pl-1">
          <span className="text-right text-[12px] font-normal text-gray-600! leading-[1.4] whitespace-nowrap w-14.5">
            {time}
          </span>
        </div>
        {imageUrl && (
          <div className="size-12 overflow-hidden rounded-2 shrink-0">
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

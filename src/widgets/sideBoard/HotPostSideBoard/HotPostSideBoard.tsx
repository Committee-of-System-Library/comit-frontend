import type { HTMLAttributes } from "react";

import { TrendingUp } from "lucide-react";

import type { HotPost } from "@/mocks/hotPosts";
import { HotPostItem } from "@/shared/ui/HotPostItem/HotPostItem";

interface HotPostSideBoardProps extends HTMLAttributes<HTMLDivElement> {
  posts: HotPost[];
}

export const HotPostSideBoard = ({
  posts,
  className = "",
  ...props
}: HotPostSideBoardProps) => {
  return (
    <div
      className={`flex w-70.5 flex-col items-start overflow-hidden rounded-xl border border-border-deactivated bg-white ${className}`}
      {...props}
    >
      <div className="flex w-full items-center gap-2 border-b border-border-deactivated px-4 py-3">
        <TrendingUp className="size-6 text-text-primary" />
        <span className="text-subtitle-04 text-text-primary font-bold">
          인기글 상위 5개
        </span>
      </div>
      <div className="flex w-full flex-col">
        {posts.slice(0, 5).map((post, index) => (
          <HotPostItem
            key={index}
            rank={index + 1}
            title={post.title}
            author={post.author}
            views={post.views}
            time={post.time}
            className={
              index === Math.min(posts.length, 5) - 1 ? "border-b-0" : ""
            }
          />
        ))}
      </div>
    </div>
  );
};

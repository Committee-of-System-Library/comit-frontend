import type { HTMLAttributes } from "react";

import { UserRound, Eye } from "lucide-react";

interface HotPostItemProps extends HTMLAttributes<HTMLDivElement> {
  rank: number | string;
  title: string;
  author: string;
  views: number | string;
  time: string;
}

export const HotPostItem = ({
  rank,
  title,
  author,
  views,
  time,
  className = "",
  ...props
}: HotPostItemProps) => {
  return (
    <div
      className={`flex w-70.5 flex-row items-start border-b border-border-deactivated bg-white px-4 pb-3 pt-2.5 transition-colors hover:bg-background-dark cursor-pointer ${className}`}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-2 pt-1 min-w-0">
        <div className="flex flex-row items-center gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-gray-50">
            <span className="text-label-03 text-text-tertiary whitespace-nowrap">
              {rank}
            </span>
          </div>
          <p className="text-subtitle-04 text-text-primary truncate flex-1">
            {title}
          </p>
        </div>
        <div className="flex flex-row items-center gap-2 pl-8">
          <div className="flex flex-row items-center text-text-placeholder gap-1 h-4.25">
            <UserRound className="w-4 h-4" />
            <span className="text-caption-02 leading-[1.4] whitespace-nowrap">
              {author}
            </span>
          </div>
          <div className="flex flex-row items-center text-text-placeholder gap-0.5 h-4.25">
            <Eye className="w-4 h-4" />
            <span className="text-caption-02 leading-[1.4] whitespace-nowrap">
              {views}
            </span>
          </div>
        </div>
      </div>
      <div className="shrink-0 pt-1 ml-2">
        <span className="text-right text-caption-02 text-text-placeholder leading-[1.4] whitespace-nowrap w-14.5 block">
          {time}
        </span>
      </div>
    </div>
  );
};

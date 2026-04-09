import type { HTMLAttributes } from "react";

import { Volume2 } from "lucide-react";

import { NoticePreviewItem } from "@/shared/ui/NoticePreviewItem/NoticePreviewItem";

export interface NoticeSideBoardItem {
  id: number;
  title: string;
  date: string;
}

interface NoticeSideBoardProps extends HTMLAttributes<HTMLDivElement> {
  notices: NoticeSideBoardItem[];
  onItemClick?: (id: number) => void;
}

export const NoticeSideBoard = ({
  notices,
  className = "",
  onItemClick,
  ...props
}: NoticeSideBoardProps) => {
  return (
    <div
      className={`flex w-70.5 flex-col items-start overflow-hidden rounded-xl border border-border-deactivated bg-white ${className}`}
      {...props}
    >
      <div className="flex w-full h-12 items-center gap-2 border-b border-border-deactivated px-4 py-3">
        <Volume2 className="size-6 text-info-01" />
        <span className="text-subtitle-04 text-text-primary font-bold">
          공지사항
        </span>
      </div>
      <div className="flex w-full flex-col">
        {notices.map((notice, index) => (
          <NoticePreviewItem
            key={notice.id}
            title={notice.title}
            date={notice.date}
            className={index === notices.length - 1 ? "border-b-0" : ""}
            onClick={() => onItemClick?.(notice.id)}
          />
        ))}
      </div>
    </div>
  );
};

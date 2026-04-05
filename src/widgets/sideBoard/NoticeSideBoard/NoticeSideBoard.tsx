import type { HTMLAttributes } from "react";

import { Volume2 } from "lucide-react";

import type { RecentNotice } from "@/mocks/recentNotices";
import { NoticePreviewItem } from "@/shared/ui/NoticePreviewItem/NoticePreviewItem";

interface NoticeSideBoardProps extends HTMLAttributes<HTMLDivElement> {
  notices: RecentNotice[];
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
            key={index}
            title={notice.title}
            date={notice.date}
            className={index === notices.length - 1 ? "border-b-0" : ""}
            onClick={
              notice.id !== undefined
                ? () => onItemClick?.(notice.id!)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

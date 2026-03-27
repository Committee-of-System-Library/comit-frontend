import type { HTMLAttributes } from "react";

import { mockHotPosts, type HotPost } from "@/mocks/hotPosts";
import { mockRecentEvents, type RecentEvent } from "@/mocks/recentEvents";
import { mockRecentNotices, type RecentNotice } from "@/mocks/recentNotices";
import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";
import { cn } from "@/utils/cn";
import { EventSideBoard } from "@/widgets/sideBoard/EventSideBoard/EventSideBoard";
import { HotPostSideBoard } from "@/widgets/sideBoard/HotPostSideBoard/HotPostSideBoard";
import { NoticeSideBoard } from "@/widgets/sideBoard/NoticeSideBoard/NoticeSideBoard";

interface DefaultRightRailProps extends HTMLAttributes<HTMLDivElement> {
  events?: RecentEvent[];
  hotPosts?: HotPost[];
  notices?: RecentNotice[];
  onWriteClick?: () => void;
}

export const DefaultRightRail = ({
  className,
  events = mockRecentEvents,
  hotPosts = mockHotPosts,
  notices = mockRecentNotices,
  onWriteClick,
  ...props
}: DefaultRightRailProps) => {
  const handleWriteClick = () => {
    if (onWriteClick) {
      onWriteClick();
      return;
    }

    if (typeof window !== "undefined") {
      window.location.assign("/write");
    }
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <WritingButton
        aria-label="글 작성하기"
        className="gap-2"
        onClick={handleWriteClick}
        variant="action"
      >
        글 작성하기
      </WritingButton>
      <NoticeSideBoard notices={notices} />
      <HotPostSideBoard posts={hotPosts} />
      <EventSideBoard events={events} />
    </div>
  );
};

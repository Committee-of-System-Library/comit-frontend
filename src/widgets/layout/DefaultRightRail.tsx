import type { HTMLAttributes } from "react";

import { useNavigate } from "react-router-dom";

import {
  mapHotPostSummaryToHotPost,
  mapPostSummaryToRecentEvent,
  mapPostSummaryToRecentNotice,
} from "@/features/post/model/postUiMappers";
import { useHotPostsQuery } from "@/features/post/model/useHotPostsQuery";
import { usePostListQuery } from "@/features/post/model/usePostListQuery";
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
  events,
  hotPosts,
  notices,
  onWriteClick,
  ...props
}: DefaultRightRailProps) => {
  const navigate = useNavigate();
  const { data: noticeData } = usePostListQuery({
    boardType: "NOTICE",
    size: 3,
  });
  const { data: eventData } = usePostListQuery({
    boardType: "EVENT",
    size: 3,
  });
  const { data: hotPostData } = useHotPostsQuery();
  const resolvedNotices: RecentNotice[] =
    notices ??
    noticeData?.posts?.map(mapPostSummaryToRecentNotice) ??
    mockRecentNotices;
  const resolvedEvents: RecentEvent[] =
    events ??
    eventData?.posts?.map(mapPostSummaryToRecentEvent) ??
    mockRecentEvents;
  const resolvedHotPosts: HotPost[] =
    hotPosts ??
    hotPostData?.posts?.map(mapHotPostSummaryToHotPost) ??
    mockHotPosts;

  const handleWriteClick = () => {
    if (onWriteClick) {
      onWriteClick();
      return;
    }

    navigate("/write");
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
      <NoticeSideBoard notices={resolvedNotices} />
      <HotPostSideBoard posts={resolvedHotPosts} />
      <EventSideBoard events={resolvedEvents} />
    </div>
  );
};

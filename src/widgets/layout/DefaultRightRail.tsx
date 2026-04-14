import type { HTMLAttributes } from "react";

import { useNavigate } from "react-router-dom";

import {
  mapPostSummaryToRecentEvent,
  mapPostSummaryToRecentNotice,
  type RightRailEventItem,
  type RightRailHotPostItem,
  type RightRailNoticeItem,
} from "@/features/post/model/postUiMappers";
import { useHotPostsQuery } from "@/features/post/model/useHotPostsQuery";
import { usePostListQuery } from "@/features/post/model/usePostListQuery";
import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";
import { cn } from "@/utils/cn";
import { EventSideBoard } from "@/widgets/sideBoard/EventSideBoard/EventSideBoard";
import { HotPostSideBoard } from "@/widgets/sideBoard/HotPostSideBoard/HotPostSideBoard";
import { NoticeSideBoard } from "@/widgets/sideBoard/NoticeSideBoard/NoticeSideBoard";

interface DefaultRightRailProps extends HTMLAttributes<HTMLDivElement> {
  events?: RightRailEventItem[];
  hideEvent?: boolean;
  hideNotice?: boolean;
  hideWritingButton?: boolean;
  hotPosts?: RightRailHotPostItem[];
  notices?: RightRailNoticeItem[];
  onWriteClick?: () => void;
}

export const DefaultRightRail = ({
  className,
  events,
  hideEvent = false,
  hideNotice = false,
  hideWritingButton = false,
  hotPosts,
  notices,
  onWriteClick,
  ...props
}: DefaultRightRailProps) => {
  const navigate = useNavigate();
  const { data: noticePosts } = usePostListQuery({
    boardType: "NOTICE",
    enabled: notices === undefined && !hideNotice,
    size: 5,
  });
  const { data: eventPosts } = usePostListQuery({
    boardType: "EVENT",
    enabled: events === undefined && !hideEvent,
    size: 5,
  });
  const { data: hotPostData } = useHotPostsQuery({
    enabled: hotPosts === undefined,
  });
  const noticeSummaries = Array.isArray(noticePosts?.posts)
    ? noticePosts.posts
    : [];
  const eventSummaries = Array.isArray(eventPosts?.posts)
    ? eventPosts.posts
    : [];
  const resolvedNotices: RightRailNoticeItem[] =
    notices ?? noticeSummaries.map(mapPostSummaryToRecentNotice);
  const resolvedEvents: RightRailEventItem[] =
    events ?? eventSummaries.map(mapPostSummaryToRecentEvent);
  const resolvedHotPosts: RightRailHotPostItem[] = Array.isArray(hotPosts)
    ? hotPosts
    : Array.isArray(hotPostData)
      ? hotPostData
      : [];

  const handleWriteClick = () => {
    if (onWriteClick) {
      onWriteClick();
      return;
    }

    navigate("/write");
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {!hideWritingButton && (
        <WritingButton
          aria-label="글 작성하기"
          className="gap-2"
          onClick={handleWriteClick}
          variant="action"
        >
          글 작성하기
        </WritingButton>
      )}
      {!hideNotice && (
        <NoticeSideBoard
          notices={resolvedNotices}
          onItemClick={(id) => navigate(`/post/${id}`)}
        />
      )}
      <HotPostSideBoard
        posts={resolvedHotPosts}
        onItemClick={(id) => navigate(`/post/${id}`)}
      />
      {!hideEvent && (
        <EventSideBoard
          events={resolvedEvents}
          onItemClick={(id) => navigate(`/post/${id}`)}
        />
      )}
    </div>
  );
};

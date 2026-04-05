import type { HTMLAttributes } from "react";

import { useNavigate } from "react-router-dom";

import {
  mapPostSummaryToRecentEvent,
  mapPostSummaryToRecentNotice,
} from "@/features/post/model/postUiMappers";
import { useHotPostsQuery } from "@/features/post/model/useHotPostsQuery";
import { usePostListQuery } from "@/features/post/model/usePostListQuery";
import type { HotPost } from "@/mocks/hotPosts";
import type { RecentEvent } from "@/mocks/recentEvents";
import type { RecentNotice } from "@/mocks/recentNotices";
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
  const { data: noticePosts } = usePostListQuery({
    boardType: "NOTICE",
    enabled: notices === undefined,
    size: 5,
  });
  const { data: eventPosts } = usePostListQuery({
    boardType: "EVENT",
    enabled: events === undefined,
    size: 5,
  });
  const { data: hotPostData } = useHotPostsQuery({
    enabled: hotPosts === undefined,
  });
  const resolvedNotices: RecentNotice[] =
    notices ?? noticePosts?.posts.map(mapPostSummaryToRecentNotice) ?? [];
  const resolvedEvents: RecentEvent[] =
    events ?? eventPosts?.posts.map(mapPostSummaryToRecentEvent) ?? [];
  const resolvedHotPosts: HotPost[] = hotPosts ?? hotPostData ?? [];

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
      <NoticeSideBoard
        notices={resolvedNotices}
        onItemClick={(id) => navigate(`/post/${id}`)}
      />
      <HotPostSideBoard
        posts={resolvedHotPosts}
        onItemClick={(id) => navigate(`/post/${id}`)}
      />
      <EventSideBoard
        events={resolvedEvents}
        onItemClick={(id) => navigate(`/post/${id}`)}
      />
    </div>
  );
};

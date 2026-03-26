import type { HTMLAttributes } from "react";

import { mockHotPosts, type HotPost } from "@/mocks/hotPosts";
import { mockRecentEvents, type RecentEvent } from "@/mocks/recentEvents";
import { mockRecentNotices, type RecentNotice } from "@/mocks/recentNotices";
import { cn } from "@/utils/cn";
import { EventSideBoard } from "@/widgets/sideBoard/EventSideBoard/EventSideBoard";
import { HotPostSideBoard } from "@/widgets/sideBoard/HotPostSideBoard/HotPostSideBoard";
import { NoticeSideBoard } from "@/widgets/sideBoard/NoticeSideBoard/NoticeSideBoard";

interface DefaultRightRailProps extends HTMLAttributes<HTMLDivElement> {
  events?: RecentEvent[];
  hotPosts?: HotPost[];
  notices?: RecentNotice[];
}

export const DefaultRightRail = ({
  className,
  events = mockRecentEvents,
  hotPosts = mockHotPosts,
  notices = mockRecentNotices,
  ...props
}: DefaultRightRailProps) => (
  <div className={cn("space-y-4", className)} {...props}>
    <HotPostSideBoard posts={hotPosts} />
    <NoticeSideBoard notices={notices} />
    <EventSideBoard events={events} />
  </div>
);

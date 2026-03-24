import type { HTMLAttributes } from "react";

import { mockHotPosts, type HotPost } from "@/mocks/hotPosts";
import { mockRecentNotices, type RecentNotice } from "@/mocks/recentNotices";
import { cn } from "@/utils/cn";
import { HotPostSideBoard } from "@/widgets/sideBoard/HotPostSideBoard/HotPostSideBoard";
import { NoticeSideBoard } from "@/widgets/sideBoard/NoticeSideBoard/NoticeSideBoard";

interface DefaultRightRailProps extends HTMLAttributes<HTMLDivElement> {
  hotPosts?: HotPost[];
  notices?: RecentNotice[];
}

export const DefaultRightRail = ({
  className,
  hotPosts = mockHotPosts,
  notices = mockRecentNotices,
  ...props
}: DefaultRightRailProps) => (
  <div className={cn("space-y-4", className)} {...props}>
    <HotPostSideBoard posts={hotPosts} />
    <NoticeSideBoard notices={notices} />
  </div>
);

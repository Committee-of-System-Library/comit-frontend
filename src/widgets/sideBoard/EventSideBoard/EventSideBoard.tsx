import type { HTMLAttributes } from "react";

import { Star } from "lucide-react";

import type { RecentEvent } from "@/mocks/recentEvents";
import { NoticePreviewItem } from "@/shared/ui/NoticePreviewItem/NoticePreviewItem";

interface EventSideBoardProps extends HTMLAttributes<HTMLDivElement> {
  events: RecentEvent[];
  onItemClick?: (id: number) => void;
}

export const EventSideBoard = ({
  events,
  className = "",
  onItemClick,
  ...props
}: EventSideBoardProps) => {
  return (
    <div
      className={`flex w-70.5 flex-col items-start overflow-hidden rounded-xl border border-border-deactivated bg-white ${className}`}
      {...props}
    >
      <div className="flex w-full h-12 items-center gap-2 border-b border-border-deactivated px-4 py-3">
        <Star className="size-6 text-warning-01" />
        <span className="text-subtitle-04 text-text-primary font-bold">
          이벤트
        </span>
      </div>
      <div className="flex w-full flex-col">
        {events.map((event, index) => (
          <NoticePreviewItem
            key={index}
            title={event.title}
            date={event.date}
            className={index === events.length - 1 ? "border-b-0" : ""}
            onClick={
              event.id !== undefined
                ? () => onItemClick?.(event.id!)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

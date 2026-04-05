import {
  Heart,
  MessageCircleMore,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { formatTimeAgo } from "@/utils/formatTime";

interface AdminPostCardProps {
  comment?: number;
  content: string;
  createdAt: string;
  disabled?: boolean;
  heart?: number;
  metaItems?: Array<{
    icon: LucideIcon;
    value: number | string;
  }>;
  onClick?: () => void;
  title: string;
  user?: string;
}

export const AdminPostCard = ({
  title,
  content,
  user,
  heart,
  comment,
  createdAt,
  disabled = false,
  onClick,
  metaItems,
}: AdminPostCardProps) => {
  const defaultMetaItems: NonNullable<AdminPostCardProps["metaItems"]> = [
    { icon: UserRound, value: user ?? "-" },
    { icon: Heart, value: heart ?? 0 },
    { icon: MessageCircleMore, value: comment ?? 0 },
  ];
  const resolvedMetaItems = metaItems ?? defaultMetaItems;

  return (
    <button
      className={cn(
        "w-full px-4 py-3.5 flex items-start justify-between rounded-xl border border-border-deactivated bg-background-light hover:bg-background-dark transition-colors duration-200 text-left",
        disabled && "opacity-50 pointer-events-none",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <div className="flex flex-1 flex-col gap-2 overflow-hidden pr-4">
        <div className="flex flex-col gap-1">
          <header className="text-subtitle-03 text-text-primary line-clamp-1">
            {title}
          </header>
          <p className="text-body-02 text-text-tertiary line-clamp-2">
            {content}
          </p>
        </div>
        <div className="flex gap-2 text-text-placeholder text-caption-02">
          {resolvedMetaItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.value}-${index}`}
                className="flex items-center gap-1"
              >
                <Icon className="w-4 h-4" />
                <span className="leading-none">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-caption-02 text-text-placeholder shrink-0">
        {formatTimeAgo(createdAt)}
      </p>
    </button>
  );
};

import type { ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import {
  MyPagePostItem,
  type MyPagePostItemProps,
} from "@/shared/ui/MyPagePostItem/MyPagePostItem";
import { cn } from "@/utils/cn";

export interface MyActivityItem extends MyPagePostItemProps {
  id: string | number;
}

export interface MyActivitySectionBoardProps {
  title: string;
  icon?: ReactNode;
  count?: number;
  items: MyActivityItem[];
  onMoreClick?: () => void;
  className?: string;
  statusMessage?: string;
}

export const MyActivitySectionBoard = ({
  title,
  icon,
  count = 0,
  items,
  onMoreClick,
  className,
  statusMessage,
}: MyActivitySectionBoardProps) => {
  return (
    <div className={cn("flex w-[752px] flex-col gap-[11px]", className)}>
      <header className="flex items-center justify-between pl-2 pr-1">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-text-primary flex size-6 items-center justify-center">
              {icon}
            </div>
          )}
          <div className="flex items-center gap-2">
            <h3 className="text-text-primary text-label-01 font-bold">
              {title}
            </h3>
            <span className="text-text-placeholder text-label-01 font-bold">
              {count}개
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onMoreClick}
          className="text-text-placeholder hover:text-text-secondary flex items-center gap-0.5 text-label-03 transition-colors"
        >
          <span>전체보기</span>
          <ChevronRight className="size-4" />
        </button>
      </header>

      <section className="bg-background-light border-border-deactivated h-[122px] overflow-hidden rounded-xl border">
        <div className="flex flex-col py-1">
          {statusMessage ? (
            <div className="flex h-[122px] items-center justify-center p-4">
              <span className="text-body-03 text-text-secondary font-medium">
                {statusMessage}
              </span>
            </div>
          ) : items.length > 0 ? (
            items
              .slice(0, 3)
              .map((item) => (
                <MyPagePostItem
                  key={item.id}
                  title={item.title}
                  createdAt={item.createdAt}
                  onClick={item.onClick}
                  className="max-w-none border-none px-4 py-2"
                />
              ))
          ) : (
            <div className="flex h-[122px] items-center justify-center p-4">
              <span className="text-body-03 text-text-secondary font-medium">
                내역이 없습니다.
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

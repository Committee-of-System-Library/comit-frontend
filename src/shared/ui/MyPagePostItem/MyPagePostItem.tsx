import { cn } from "@/utils/cn";

export interface MyPagePostItemProps {
  title: string;
  createdAt: string;
  className?: string;
  onClick?: () => void;
}

export const MyPagePostItem = ({
  title,
  createdAt,
  className,
  onClick,
}: MyPagePostItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border-border-deactivated flex w-full max-w-[547px] cursor-pointer items-center justify-between border-b px-4 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none",
        className,
      )}
    >
      <p className="text-body-02 text-text-secondary flex-1 truncate">
        {title}
      </p>
      <span className="text-label-06 text-text-tertiary ml-2 shrink-0 whitespace-nowrap">
        {createdAt}
      </span>
    </button>
  );
};

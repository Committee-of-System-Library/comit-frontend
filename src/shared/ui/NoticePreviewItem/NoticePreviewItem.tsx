import type { HTMLAttributes } from "react";

interface NoticePreviewItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  date: string;
}

export const NoticePreviewItem = ({
  title,
  date,
  className = "",
  ...props
}: NoticePreviewItemProps) => {
  return (
    <div
      className={`flex w-70.5 flex-col items-start border-b border-border-deactivated bg-white px-4 py-3 transition-colors hover:bg-gray-100 cursor-pointer ${className}`}
      {...props}
    >
      <p className="w-full truncate text-[14px] leading-[1.6] text-text-secondary! font-normal">
        {title}
      </p>
      <p className="w-full truncate text-[12px] leading-[1.4] text-text-placeholder! font-normal">
        {date}
      </p>
    </div>
  );
};

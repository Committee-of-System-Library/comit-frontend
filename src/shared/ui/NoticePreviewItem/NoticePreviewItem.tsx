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
      className={`flex w-70.5 flex-col items-start border-b border-border-deactivated bg-white px-4 py-3 transition-colors hover:bg-background-dark cursor-pointer ${className}`}
      {...props}
    >
      <p className="w-full truncate text-body-02 leading-[1.6] text-text-secondary">
        {title}
      </p>
      <p className="w-full truncate text-caption-02 leading-[1.4] text-text-tertiary">
        {date}
      </p>
    </div>
  );
};

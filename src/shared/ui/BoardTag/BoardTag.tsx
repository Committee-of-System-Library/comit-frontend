import type { HTMLAttributes } from "react";

interface BoardTagProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
}

export const BoardTag = ({
  label,
  className = "",
  ...props
}: BoardTagProps) => {
  return (
    <div
      className={`inline-flex items-center justify-center px-2 py-1 bg-gray-50 rounded-sm whitespace-nowrap ${className}`}
      {...props}
    >
      <span className="text-subtitle-04 text-text-tertiary">{label}</span>
    </div>
  );
};

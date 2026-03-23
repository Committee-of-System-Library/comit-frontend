import type { HTMLAttributes } from "react";

import { Plus, X } from "lucide-react";

type HashtagType = "default" | "add" | "exclude";

interface HashtagProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  type?: HashtagType;
}

export const Hashtag = ({
  label,
  type = "default",
  className = "",
  ...props
}: HashtagProps) => {
  return (
    <div
      className={`inline-flex items-center gap-0.5 px-1 py-0.5 bg-gray-50 rounded-sm cursor-pointer ${className}`}
      {...props}
    >
      {type === "add" && (
        <Plus className="size-4 text-text-tertiary shrink-0" />
      )}
      {type === "exclude" && (
        <X className="size-4 text-text-tertiary shrink-0" />
      )}
      <span className="text-caption-02 text-text-tertiary">#</span>
      <span className="text-caption-02 text-text-tertiary whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

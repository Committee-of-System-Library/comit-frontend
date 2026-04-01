import { type ButtonHTMLAttributes } from "react";

import { ChevronRight } from "lucide-react";

import { cn } from "@/utils/cn";

export interface MyActivityCategoryProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
}

export const MyActivityCategory = ({
  label,
  selected = false,
  className,
  ...props
}: MyActivityCategoryProps) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex w-[282px] h-[50px] shrink-0 items-center justify-between rounded-xl border transition-colors bg-transparent px-2",
        selected
          ? "bg-white border-primary-600"
          : "border-border-deactivated hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "text-label-01 px-2 pointer-events-none truncate",
          selected ? "text-primary-600 font-bold" : "text-text-tertiary",
        )}
      >
        {label}
      </span>
      <ChevronRight
        className={cn(
          "w-6 h-6 shrink-0 pointer-events-none",
          selected ? "text-primary-600" : "text-text-placeholder",
        )}
      />
    </button>
  );
};

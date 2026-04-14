import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from "react";

import { PencilLine, Trash2, Siren } from "lucide-react";

import { cn } from "@/utils/cn";

type OptionItemVariant = "report" | "delete" | "edit";

const baseClass =
  "w-[92px] h-[48px] flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClassMap: Record<OptionItemVariant, string> = {
  report: "bg-white hover:bg-gray-100",
  delete: "bg-white hover:bg-gray-100",
  edit: "bg-white hover:bg-gray-100",
};

const ariaLabelMap: Record<OptionItemVariant, string> = {
  report: "신고 버튼",
  delete: "삭제 버튼",
  edit: "편집 버튼",
};

export interface OptionItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: OptionItemVariant;
}

export const OptionItem = forwardRef<HTMLButtonElement, OptionItemProps>(
  (
    {
      className,
      type = "button",
      variant = "report",
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          baseClass,
          variantClassMap[variant],
          variant === "edit" ? "text-text-primary" : "text-error-03",
          className,
        )}
        aria-label={ariaLabelMap[variant]}
        onClick={handleClick}
        {...props}
      >
        {variant === "report" && (
          <>
            <Siren className="w-5 h-5" />
            <p className="text-label-04 leading-none">신고</p>
          </>
        )}

        {variant === "delete" && (
          <>
            <Trash2 className="w-5 h-5" />
            <p className="text-label-04 leading-none">삭제</p>
          </>
        )}

        {variant === "edit" && (
          <>
            <PencilLine className="w-5 h-5" />
            <p className="text-label-04 leading-none">수정</p>
          </>
        )}
      </button>
    );
  },
);

OptionItem.displayName = "OptionItem";

import { forwardRef, type ButtonHTMLAttributes } from "react";

import { Heart } from "lucide-react";

import { cn } from "@/utils/cn";

type HeartButtonVariant = "liked" | "unLiked";

const baseClass =
  "group h-[40px] px-2 border flex items-center justify-center gap-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed";
const variantClassMap: Record<HeartButtonVariant, string> = {
  liked: "bg-error-03/8 hover:bg-error-03/20 border-border-error-03",
  unLiked: "bg-white hover:bg-background-dark border-border-deactivated",
};

export interface HeartButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HeartButtonVariant;
  count?: number;
}

export const HeartButton = forwardRef<HTMLButtonElement, HeartButtonProps>(
  (
    {
      className,
      type = "button",
      variant = "liked",
      count = 0,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isLiked = variant === "liked";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          baseClass,
          variantClassMap[variant],
          isLiked ? "text-error-03" : "text-gray-500",
          className,
        )}
        aria-label={isLiked ? "좋아요 눌림 버튼" : "좋아요 안 눌림 버튼"}
        {...props}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors duration-200",
            isLiked ? "fill-current" : "",
          )}
        />
        <p className="text-label-05 transition-colors duration-200">
          {count}개
        </p>
      </button>
    );
  },
);

HeartButton.displayName = "HeartButton";

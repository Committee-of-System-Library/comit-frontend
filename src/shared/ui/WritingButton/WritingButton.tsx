import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { PencilLine } from "lucide-react";

import { cn } from "@/utils/cn";

type WritingButtonVariant = "writing" | "action";

const baseClass =
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-label-01 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2";

const variantClassMap: Record<WritingButtonVariant, string> = {
  writing:
    "group h-12 gap-2 bg-primary-600 py-3.25 text-text-inverse hover:bg-primary-1000 disabled:cursor-not-allowed disabled:opacity-50",
  action:
    "group h-[50px] bg-primary-600 px-[86px] text-text-inverse hover:bg-primary-1000 active:bg-primary-800 disabled:cursor-not-allowed disabled:bg-primary-200 disabled:text-text-inverse disabled:hover:bg-primary-200 disabled:active:bg-primary-200",
};

export interface WritingButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  variant?: WritingButtonVariant;
  fullWidth?: boolean;
  icon?: ReactNode;
  type?: "button" | "submit" | "reset";
}

export const WritingButton = forwardRef<HTMLButtonElement, WritingButtonProps>(
  (
    {
      type = "button",
      variant = "writing",
      fullWidth = true,
      icon,
      children = "글 작성하기",
      className,
      ...props
    },
    ref,
  ) => {
    const iconClassName = cn(
      "size-5 shrink-0 transition-colors duration-200",
      variant === "writing" || variant === "action"
        ? "text-text-inverse group-hover:text-text-deactivated"
        : "text-text-inverse",
    );

    const resolvedIcon =
      icon === undefined ? (
        <PencilLine aria-hidden className={iconClassName} />
      ) : (
        icon
      );

    const labelClassName = cn(
      "transition-colors duration-200",
      variant === "writing" || variant === "action"
        ? "group-hover:text-text-deactivated"
        : undefined,
    );

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseClass,
          fullWidth && "w-full",
          variantClassMap[variant],
          className,
        )}
        {...props}
      >
        {resolvedIcon}
        <span className={labelClassName}>{children}</span>
      </button>
    );
  },
);

WritingButton.displayName = "WritingButton";

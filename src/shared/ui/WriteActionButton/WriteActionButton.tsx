import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type WriteActionButtonVariant = "default" | "dark";

const baseClass =
  "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl px-6 text-label-03 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed";

const variantClassMap: Record<WriteActionButtonVariant, string> = {
  default:
    "bg-primary-600 text-text-inverse hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500",
  dark: "bg-primary-1000 text-text-inverse hover:bg-primary-900 disabled:bg-gray-300 disabled:text-gray-500",
};

export interface WriteActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: WriteActionButtonVariant;
  fullWidth?: boolean;
}

export const WriteActionButton = forwardRef<
  HTMLButtonElement,
  WriteActionButtonProps
>(
  (
    {
      type = "button",
      variant = "default",
      fullWidth = true,
      className,
      ...props
    },
    ref,
  ) => (
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
    />
  ),
);

WriteActionButton.displayName = "WriteActionButton";

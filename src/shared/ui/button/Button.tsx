import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary";

const baseClass =
  "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg px-3 text-label-04 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed";

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-text-inverse hover:bg-primary-1000 disabled:bg-gray-300 disabled:text-gray-500",
  secondary:
    "border border-gray-200 bg-white text-text-primary hover:bg-gray-50 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(baseClass, variantClassMap[variant], className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";

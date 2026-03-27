import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type TextBadgeVariant = "primary" | "secondary";

const variantClassMap: Record<TextBadgeVariant, string> = {
  primary: "bg-primary-600 text-text-inverse",
  secondary: "bg-gray-100 text-text-tertiary",
};

export interface TextBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TextBadgeVariant;
}

export const TextBadge = ({
  children,
  className,
  variant = "secondary",
  ...props
}: TextBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1.5 text-label-06",
      variantClassMap[variant],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

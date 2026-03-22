import type { HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type TextBadgeVariant = "primary" | "secondary";

const variantClassMap: Record<TextBadgeVariant, string> = {
  primary: "bg-primary-700 text-white",
  secondary: "bg-gray-100 text-gray-600",
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
      "inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold",
      variantClassMap[variant],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

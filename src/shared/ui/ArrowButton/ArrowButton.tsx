import type { ButtonHTMLAttributes } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right";
}

export const ArrowButton = ({
  direction,
  className = "",
  ...props
}: ArrowButtonProps) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      className={`group relative flex size-10 items-center justify-center rounded-full bg-transparent transition-colors hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      {...props}
    >
      <Icon className="size-6 text-text-primary" strokeWidth={2.5} />
    </button>
  );
};

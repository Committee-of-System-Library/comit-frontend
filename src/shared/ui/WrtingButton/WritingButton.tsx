import { forwardRef, type ButtonHTMLAttributes } from "react";

import { PencilLine } from "lucide-react";

import { cn } from "@/utils/cn";

type WritingButtonVariant = "write" | "complete";

const baseClass =
  "group w-full h-12 py-3.25 flex items-center justify-center gap-2 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none";

const variantClassMap: Record<WritingButtonVariant, string> = {
  write: "bg-primary-600 hover:bg-primary-1000",
  complete: "bg-primary-600 hover:bg-primary-1000",
};
export interface WritingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: WritingButtonVariant;
}

export const WritingButton = forwardRef<HTMLButtonElement, WritingButtonProps>(
  (
    { className, type = "button", variant = "write", disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(baseClass, variantClassMap[variant], className)}
      aria-label={variant === "write" ? "글 작성하기 버튼" : "작성 완료 버튼"}
      {...props}
    >
      {variant === "write" && (
        <>
          <PencilLine className="w-5 h-5 text-text-inverse group-hover:text-text-deactivated transition-colors duration-200" />
          <p className="text-label-01 text-text-inverse group-hover:text-text-deactivated transition-colors duration-200">
            글 작성하기
          </p>
        </>
      )}

      {variant === "complete" && (
        <p className="text-label-01 text-text-inverse group-hover:text-text-deactivated transition-colors duration-200">
          작성 완료
        </p>
      )}
    </button>
  ),
);

WritingButton.displayName = "WritingButton";

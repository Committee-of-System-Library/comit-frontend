import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type UserNameInputProps = InputHTMLAttributes<HTMLInputElement>;

export const UserNameInput = forwardRef<HTMLInputElement, UserNameInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "bg-background-light border-border-default h-[34px] w-[152px] rounded-lg border px-2 py-1.5",
          "text-label-04 text-text-primary placeholder:text-text-placeholder",
          "focus:border-primary-600 focus:outline-none",
          className,
        )}
        placeholder="사용자명"
        {...props}
      />
    );
  },
);

UserNameInput.displayName = "UserNameInput";

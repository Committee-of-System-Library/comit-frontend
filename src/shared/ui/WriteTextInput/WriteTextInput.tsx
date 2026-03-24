import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from "react";

import { cn } from "@/utils/cn";

export interface WriteTextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: ReactNode;
  helperText?: string;
  errorMessage?: string;
}

export const WriteTextInput = forwardRef<HTMLInputElement, WriteTextInputProps>(
  ({ id, label, helperText, errorMessage, className, ...props }, ref) => {
    const fallbackId = useId();
    const inputId = id ?? `write-text-input-${fallbackId}`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-2">
        {label ? (
          <label className="text-label-04 text-text-tertiary" htmlFor={inputId}>
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={helperText || errorMessage ? helperId : undefined}
          className={cn(
            "h-11 w-full rounded-xl border px-4 text-sm text-text-primary transition-colors",
            "placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
            errorMessage
              ? "border-error-01"
              : "border-gray-200 focus-visible:border-primary-700",
            "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400",
            className,
          )}
          type="text"
          {...props}
        />

        {helperText || errorMessage ? (
          <p
            className={cn(
              "text-label-06",
              errorMessage ? "text-error-01" : "text-text-tertiary",
            )}
            id={helperId}
            role={errorMessage ? "alert" : undefined}
          >
            {errorMessage ?? helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

WriteTextInput.displayName = "WriteTextInput";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useMemo,
} from "react";

import { cn } from "@/utils/cn";

export interface WriteTextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: ReactNode;
  labelClassName?: string;
  helperText?: string;
  errorMessage?: string;
  inlineError?: boolean;
  showCount?: boolean;
}

const getStringLength = (
  value: InputHTMLAttributes<HTMLInputElement>["value"] | undefined,
  fallback: InputHTMLAttributes<HTMLInputElement>["defaultValue"] | undefined,
) => {
  if (typeof value === "string") {
    return value.length;
  }

  if (typeof fallback === "string") {
    return fallback.length;
  }

  return 0;
};

export const WriteTextInput = forwardRef<HTMLInputElement, WriteTextInputProps>(
  (
    {
      id,
      label,
      labelClassName,
      helperText,
      errorMessage,
      inlineError = false,
      showCount = false,
      className,
      placeholder,
      value,
      defaultValue,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const fallbackId = useId();
    const inputId = id ?? `write-text-input-${fallbackId}`;
    const helperId = `${inputId}-helper`;
    const currentLength = useMemo(
      () => getStringLength(value, defaultValue),
      [defaultValue, value],
    );

    const shouldShowInlineError = inlineError && Boolean(errorMessage);

    return (
      <div className="space-y-[8px]">
        {label ? (
          <label
            className={cn(
              "block pl-3 text-label-01 text-text-tertiary",
              labelClassName,
            )}
            htmlFor={inputId}
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={helperText || errorMessage ? helperId : undefined}
            className={cn(
              "h-[50px] w-full rounded-xl border bg-background-light px-4 text-body-02 text-text-primary transition-colors",
              shouldShowInlineError
                ? "placeholder:text-error-03"
                : "placeholder:text-text-placeholder",
              "focus-visible:outline-none focus-visible:ring-primary-100",
              errorMessage
                ? "border-error-01"
                : "border-gray-200 focus-visible:border-primary-700",
              "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400",
              showCount ? "pr-22" : "",
              className,
            )}
            defaultValue={defaultValue}
            maxLength={maxLength}
            type="text"
            placeholder={shouldShowInlineError ? errorMessage : placeholder}
            value={value}
            {...props}
          />

          {showCount ? (
            <p
              className={cn(
                "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-caption-02",
                errorMessage ? "text-error-01" : "text-text-placeholder",
              )}
            >
              {currentLength}
              {typeof maxLength === "number" ? `/${maxLength}` : null}
            </p>
          ) : null}
        </div>

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

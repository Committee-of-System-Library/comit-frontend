import {
  forwardRef,
  type ReactNode,
  type TextareaHTMLAttributes,
  useId,
  useMemo,
} from "react";

import { cn } from "@/utils/cn";

export interface WriteTextareaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> {
  label?: ReactNode;
  labelClassName?: string;
  helperText?: string;
  errorMessage?: string;
  showCount?: boolean;
}

const getStringLength = (
  value: TextareaHTMLAttributes<HTMLTextAreaElement>["value"] | undefined,
  fallback:
    | TextareaHTMLAttributes<HTMLTextAreaElement>["defaultValue"]
    | undefined,
) => {
  if (typeof value === "string") {
    return value.length;
  }

  if (typeof fallback === "string") {
    return fallback.length;
  }

  return 0;
};

export const WriteTextareaField = forwardRef<
  HTMLTextAreaElement,
  WriteTextareaFieldProps
>(
  (
    {
      id,
      label,
      labelClassName,
      helperText,
      errorMessage,
      className,
      showCount = true,
      value,
      defaultValue,
      maxLength,
      rows = 8,
      ...props
    },
    ref,
  ) => {
    const fallbackId = useId();
    const textareaId = id ?? `write-textarea-${fallbackId}`;
    const helperId = `${textareaId}-helper`;

    const currentLength = useMemo(
      () => getStringLength(value, defaultValue),
      [defaultValue, value],
    );

    return (
      <div className="space-y-[8px]">
        {label ? (
          <label
            className={cn(
              "block pl-3 text-label-01 text-text-tertiary",
              labelClassName,
            )}
            htmlFor={textareaId}
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={helperText || errorMessage ? helperId : undefined}
            className={cn(
              "min-h-60 w-full resize-none rounded-xl border bg-background-light p-4 text-body-01 text-text-primary transition-colors",
              "placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
              errorMessage
                ? "border-error-01"
                : "border-gray-200 focus-visible:border-primary-700",
              "pb-4 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400",
              className,
            )}
            defaultValue={defaultValue}
            maxLength={maxLength}
            rows={rows}
            value={value}
            {...props}
          />

          {showCount ? (
            <p className="pointer-events-none absolute right-4 bottom-5 text-caption-02 text-text-placeholder">
              {currentLength}자
              {typeof maxLength === "number" ? "/최대글자수" : null}
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

WriteTextareaField.displayName = "WriteTextareaField";

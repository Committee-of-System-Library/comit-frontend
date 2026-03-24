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
      <div className="space-y-2">
        {label ? (
          <label
            className="text-label-04 text-text-tertiary"
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
              "min-h-[220px] w-full resize-none rounded-xl border px-4 py-3 text-sm text-text-primary transition-colors",
              "placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
              errorMessage
                ? "border-error-01"
                : "border-gray-200 focus-visible:border-primary-700",
              "pb-10 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400",
              className,
            )}
            defaultValue={defaultValue}
            maxLength={maxLength}
            rows={rows}
            value={value}
            {...props}
          />

          {showCount ? (
            <p className="pointer-events-none absolute bottom-3 right-4 text-label-06 text-text-tertiary">
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

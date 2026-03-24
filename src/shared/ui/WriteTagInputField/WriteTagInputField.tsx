import { type KeyboardEvent, useId } from "react";

import { Plus, X } from "lucide-react";

import { cn } from "@/utils/cn";

export interface WriteTagInputFieldProps {
  id?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  tags?: string[];
  value?: string;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
  onValueChange?: (nextValue: string) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
}

export const WriteTagInputField = ({
  id,
  label,
  helperText,
  errorMessage,
  tags = [],
  value = "",
  placeholder = "게시글 해시태그 5개를 최대로 지정할 수 있습니다",
  maxTags = 5,
  disabled = false,
  className,
  onValueChange,
  onAddTag,
  onRemoveTag,
}: WriteTagInputFieldProps) => {
  const fallbackId = useId();
  const inputId = id ?? `write-tag-input-${fallbackId}`;
  const helperId = `${inputId}-helper`;

  const isLimitReached = tags.length >= maxTags;

  const handleAdd = () => {
    const normalizedValue = value.trim();

    if (!normalizedValue || isLimitReached || disabled) {
      return;
    }

    onAddTag?.(normalizedValue);
    onValueChange?.("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="text-label-04 text-text-tertiary" htmlFor={inputId}>
          {label}
        </label>
      ) : null}

      <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={helperText || errorMessage ? helperId : undefined}
            className={cn(
              "h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm text-text-primary",
              "placeholder:text-text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
              errorMessage
                ? "border-error-01"
                : "border-gray-200 focus-visible:border-primary-700",
              "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400",
            )}
            disabled={disabled || isLimitReached}
            onChange={(event) => onValueChange?.(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            type="text"
            value={value}
          />

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-text-tertiary transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300"
            disabled={disabled || isLimitReached || !value.trim()}
            onClick={handleAdd}
            type="button"
          >
            <Plus aria-hidden className="size-4" />
          </button>
        </div>

        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <div className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-label-06 text-text-tertiary">
                  <span className="truncate"># {tag}</span>
                  <button
                    aria-label={`${tag} 태그 삭제`}
                    className="rounded-sm p-0.5 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                    disabled={disabled}
                    onClick={() => onRemoveTag?.(tag)}
                    type="button"
                  >
                    <X aria-hidden className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-4">
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

        <p className="shrink-0 text-label-06 text-text-tertiary">
          {tags.length}/{maxTags}
        </p>
      </div>
    </div>
  );
};

import { type KeyboardEvent, type ReactNode, useId } from "react";

import { Plus, X } from "lucide-react";

import { cn } from "@/utils/cn";

export interface WriteTagInputFieldProps {
  id?: string;
  label?: ReactNode;
  labelClassName?: string;
  helperText?: string;
  errorMessage?: string;
  tags?: string[];
  value?: string;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
  chipPrefix?: string;
  chipClassName?: string;
  emptyChips?: string[];
  availableTags?: string[];
  selectionOnly?: boolean;
  inlineError?: boolean;
  showCount?: boolean;
  showAddButton?: boolean;
  showLeadingPlusIcon?: boolean;
  showRemoveButton?: boolean;
  onValueChange?: (nextValue: string) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  onToggleTag?: (tag: string) => void;
}

export const WriteTagInputField = ({
  id,
  label,
  labelClassName,
  helperText,
  errorMessage,
  tags = [],
  value = "",
  placeholder = "게시글당 최대 5개의 태그를 지정할 수 있습니다",
  maxTags = 5,
  disabled = false,
  className,
  chipPrefix = "#",
  chipClassName,
  emptyChips = [],
  availableTags = [],
  selectionOnly = false,
  inlineError = false,
  showCount = true,
  showAddButton = true,
  showLeadingPlusIcon = false,
  showRemoveButton = true,
  onValueChange,
  onAddTag,
  onRemoveTag,
  onToggleTag,
}: WriteTagInputFieldProps) => {
  const fallbackId = useId();
  const inputId = id ?? `write-tag-input-${fallbackId}`;
  const helperId = `${inputId}-helper`;

  const isLimitReached = tags.length >= maxTags;
  const shouldShowInlineError = inlineError && Boolean(errorMessage);

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

  const selectableTags = availableTags.length > 0 ? availableTags : emptyChips;
  const selectedTagSet = new Set(tags);
  const remainingSelectableTags = selectableTags.filter(
    (tag) => !selectedTagSet.has(tag),
  );

  const handleSelectTag = (tag: string) => {
    if (disabled || isLimitReached) {
      return;
    }

    if (onToggleTag) {
      onToggleTag(tag);
      return;
    }

    onAddTag?.(tag);
  };

  const handleRemoveSelectedTag = (tag: string) => {
    if (disabled) {
      return;
    }

    if (onToggleTag) {
      onToggleTag(tag);
      return;
    }

    onRemoveTag?.(tag);
  };

  return (
    <div className={cn("space-y-2", className)}>
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

      {selectionOnly ? (
        <div
          aria-describedby={
            helperText || (errorMessage && !shouldShowInlineError)
              ? helperId
              : undefined
          }
          className={cn(
            tags.length > 0 ? "min-h-[68px] p-4" : "h-[55px] px-4",
            "rounded-xl border bg-background-light",
            errorMessage ? "border-error-01" : "border-gray-200",
          )}
          id={inputId}
        >
          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={`selected-${tag}`}>
                  <button
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm bg-gray-50 px-2 py-1 text-caption-02 text-text-tertiary transition-colors",
                      "hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300",
                      chipClassName,
                    )}
                    disabled={disabled}
                    onClick={() => handleRemoveSelectedTag(tag)}
                    type="button"
                  >
                    {showRemoveButton ? (
                      <X aria-hidden className="size-3" />
                    ) : null}
                    <span>
                      {chipPrefix} {tag}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className={cn(
                "flex h-full items-center",
                shouldShowInlineError
                  ? "text-error-03"
                  : "text-text-placeholder",
              )}
            >
              {shouldShowInlineError ? errorMessage : placeholder}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={
              helperText || (errorMessage && !shouldShowInlineError)
                ? helperId
                : undefined
            }
            className={cn(
              "h-[55px] min-w-0 flex-1 rounded-xl border px-4 text-label-04 text-text-primary",
              shouldShowInlineError
                ? "placeholder:text-error-03"
                : "placeholder:text-text-placeholder",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
              errorMessage
                ? "border-error-01"
                : "border-gray-200 focus-visible:border-primary-700",
              "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400",
            )}
            disabled={disabled || isLimitReached}
            onChange={(event) => onValueChange?.(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={shouldShowInlineError ? errorMessage : placeholder}
            type="text"
            value={value}
          />

          {showAddButton ? (
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-text-tertiary transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300"
              disabled={disabled || isLimitReached || !value.trim()}
              onClick={handleAdd}
              type="button"
            >
              <Plus aria-hidden className="size-4" />
            </button>
          ) : null}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        {selectionOnly ? (
          remainingSelectableTags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {remainingSelectableTags.map((tag) => (
                <li key={`available-${tag}`}>
                  <button
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-sm bg-gray-50 px-2 py-1 text-caption-02 text-text-tertiary transition-colors",
                      "hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300",
                      chipClassName,
                    )}
                    disabled={disabled || isLimitReached}
                    onClick={() => handleSelectTag(tag)}
                    type="button"
                  >
                    {showLeadingPlusIcon ? (
                      <Plus aria-hidden className="size-3.5 text-gray-500" />
                    ) : null}
                    <span>
                      {chipPrefix} {tag}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-label-06 text-text-deactivated">
              추가 가능한 태그가 없습니다
            </p>
          )
        ) : tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <div
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-sm bg-gray-50 px-1 py-0.5 text-caption-02 text-text-tertiary",
                    chipClassName,
                  )}
                >
                  {showLeadingPlusIcon ? (
                    <Plus aria-hidden className="size-4 text-gray-500" />
                  ) : null}
                  <span>
                    {chipPrefix} {tag}
                  </span>
                  {showRemoveButton ? (
                    <button
                      aria-label={`${tag} 태그 삭제`}
                      className="rounded-sm p-0.5 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                      disabled={disabled}
                      onClick={() => onRemoveTag?.(tag)}
                      type="button"
                    >
                      <X aria-hidden className="size-3.5" />
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : emptyChips.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {emptyChips.map((tag, index) => (
              <li key={`${tag}-${index}`}>
                <div
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-sm bg-gray-50 px-1 py-0.5 text-caption-02 text-text-tertiary",
                    chipClassName,
                  )}
                >
                  {showLeadingPlusIcon ? (
                    <Plus aria-hidden className="size-4 text-gray-500" />
                  ) : null}
                  <span>
                    {chipPrefix} {tag}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-label-06 text-text-deactivated">태그가 없습니다</p>
        )}
      </div>

      {helperText || (errorMessage && !shouldShowInlineError) || showCount ? (
        <div className="flex items-start justify-between gap-4">
          {helperText || (errorMessage && !shouldShowInlineError) ? (
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

          {showCount ? (
            <p className="shrink-0 text-label-06 text-text-tertiary">
              {tags.length}/{maxTags}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

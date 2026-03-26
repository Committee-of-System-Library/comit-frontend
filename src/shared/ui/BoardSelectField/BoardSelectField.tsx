import { useEffect, useId, useMemo, useRef, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/utils/cn";

export interface BoardSelectOption {
  label: string;
  value: string;
}

export interface BoardSelectFieldProps {
  id?: string;
  label?: string;
  placeholder?: string;
  options: BoardSelectOption[];
  value?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  onChange?: (value: string) => void;
}

export const BoardSelectField = ({
  id,
  label,
  placeholder = "게시판 선택하기",
  options,
  value,
  errorMessage,
  disabled = false,
  className,
  menuClassName,
  onChange,
}: BoardSelectFieldProps) => {
  const fallbackId = useId();
  const selectId = id ?? `board-select-${fallbackId}`;
  const errorId = `${selectId}-error`;

  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const displayLabel = selectedOption?.label ?? placeholder;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsOpen((prev) => !prev);
  };

  const handleSelect = (nextValue: string) => {
    onChange?.(nextValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)} ref={rootRef}>
      {label ? (
        <label className="text-label-04 text-text-tertiary" htmlFor={selectId}>
          {label}
        </label>
      ) : null}

      <div className="relative">
        <button
          id={selectId}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-describedby={errorMessage ? errorId : undefined}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
            errorMessage
              ? "border-error-01 text-error-01"
              : "border-gray-200 text-text-secondary focus-visible:border-primary-700",
            disabled &&
              "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 focus-visible:ring-0",
            isOpen && !errorMessage && "border-primary-700",
          )}
          disabled={disabled}
          onClick={handleToggle}
          type="button"
        >
          <span
            className={cn(
              "truncate",
              selectedOption ? "text-text-primary" : "text-text-placeholder",
              disabled && "text-gray-400",
            )}
          >
            {displayLabel}
          </span>
          {isOpen ? (
            <ChevronUp aria-hidden className="size-4 shrink-0" />
          ) : (
            <ChevronDown aria-hidden className="size-4 shrink-0" />
          )}
        </button>

        {isOpen ? (
          <ul
            className={cn(
              "absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-primary-300 bg-white py-1 shadow-sm",
              menuClassName,
            )}
            role="listbox"
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    className={cn(
                      "flex w-full items-center px-4 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary-50 text-primary-700"
                        : "text-text-secondary hover:bg-gray-50",
                    )}
                    onClick={() => handleSelect(option.value)}
                    type="button"
                  >
                    <span className="truncate">{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="text-label-06 text-error-01" id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/utils/cn";

export interface BoardSelectOption {
  label: string;
  value: string;
}

export interface BoardSelectFieldProps {
  id?: string;
  label?: ReactNode;
  labelClassName?: string;
  placeholder?: string;
  options: BoardSelectOption[];
  value?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  triggerClassName?: string;
  onChange?: (value: string) => void;
}

export const BoardSelectField = ({
  id,
  label,
  labelClassName,
  placeholder = "게시판 선택하기",
  options,
  value,
  errorMessage,
  disabled = false,
  className,
  menuClassName,
  triggerClassName,
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
        <label
          className={cn(
            "pl-3 text-base leading-10 font-bold text-text-tertiary",
            labelClassName,
          )}
          htmlFor={selectId}
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-white transition-colors duration-400",
          errorMessage
            ? "border-error-01"
            : isOpen
              ? "border-primary-700"
              : "border-gray-200",
          disabled && "border-gray-200 bg-gray-50",
        )}
      >
        <button
          id={selectId}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-describedby={errorMessage ? errorId : undefined}
          className={cn(
            "flex h-12 w-full items-center justify-between px-4 text-left text-sm leading-5 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
            errorMessage
              ? "text-error-01"
              : "text-text-secondary focus-visible:border-primary-700",
            disabled &&
              "cursor-not-allowed bg-gray-50 text-gray-400 focus-visible:ring-0",
            triggerClassName,
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

        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-400 ease-out",
            isOpen
              ? "max-h-56 opacity-100"
              : "pointer-events-none max-h-0 opacity-0",
          )}
        >
          <ul
            className={cn(
              "max-h-56 overflow-y-auto border-t border-gray-100 py-1",
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
                      "flex w-full items-center px-4 py-3.5 text-left text-sm leading-5 transition-colors",
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
        </div>
      </div>

      {errorMessage ? (
        <p className="text-label-06 text-error-01" id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

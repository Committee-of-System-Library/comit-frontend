import {
  forwardRef,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEventHandler,
  useState,
} from "react";

import { SignupOutlineButton } from "../SignupOutlineButton/SignupOutlineButton";

import { cn } from "@/utils/cn";

export interface SignupTextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  active?: boolean;
  actionAriaLabel?: string;
  actionClassName?: string;
  actionDisabled?: boolean;
  actionLabel?: string;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
}

export const SignupTextInput = forwardRef<
  HTMLInputElement,
  SignupTextInputProps
>(
  (
    {
      active = false,
      actionAriaLabel,
      actionClassName,
      actionDisabled = false,
      actionLabel,
      className,
      disabled = false,
      onActionClick,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const isActive = !disabled && (active || isFocused);

    return (
      <div
        className={cn(
          "flex h-11 w-full items-center rounded-xl border bg-background-light px-4 transition-colors",
          actionLabel ? "pr-1.5" : "pr-4",
          disabled
            ? "border-border-default bg-gray-100"
            : isActive
              ? "border-primary-600"
              : "border-border-deactivated",
          className,
        )}
      >
        <input
          ref={ref}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-label-02 text-text-primary placeholder:text-text-placeholder focus:outline-none",
            disabled && "text-text-placeholder",
          )}
          disabled={disabled}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...props}
        />

        {actionLabel ? (
          <SignupOutlineButton
            aria-label={actionAriaLabel ?? actionLabel}
            className={cn("shrink-0", actionClassName)}
            disabled={disabled || actionDisabled}
            onClick={onActionClick}
          >
            {actionLabel}
          </SignupOutlineButton>
        ) : null}
      </div>
    );
  },
);

SignupTextInput.displayName = "SignupTextInput";

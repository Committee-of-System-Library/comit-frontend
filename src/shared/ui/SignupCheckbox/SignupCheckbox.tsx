import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from "react";

import { Check } from "lucide-react";

import { cn } from "@/utils/cn";

export interface SignupCheckboxProps {
  ariaLabel?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

type SignupCheckboxBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
>;

export type SignupCheckboxMergedProps = SignupCheckboxProps &
  SignupCheckboxBaseProps;

export const SignupCheckbox = forwardRef<
  HTMLButtonElement,
  SignupCheckboxMergedProps
>(
  (
    {
      ariaLabel = "약관 동의 체크박스",
      className,
      checked = false,
      disabled = false,
      onCheckedChange,
      onClick,
      ...props
    },
    ref,
  ) => {
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      onCheckedChange?.(!checked);
    };

    return (
      <button
        {...props}
        ref={ref}
        aria-checked={checked}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-[4px] border transition-colors",
          checked
            ? "border-primary-600 bg-primary-600 text-text-inverse"
            : "border-border-deactivated bg-background-light text-transparent",
          disabled &&
            "cursor-not-allowed border-border-default bg-gray-100 text-text-deactivated",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
          className,
        )}
        disabled={disabled}
        onClick={handleClick}
        role="checkbox"
        type="button"
      >
        <Check aria-hidden className="size-[14px]" />
      </button>
    );
  },
);

SignupCheckbox.displayName = "SignupCheckbox";

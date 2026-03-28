import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export type SignupOutlineButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const SignupOutlineButton = forwardRef<
  HTMLButtonElement,
  SignupOutlineButtonProps
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex items-center justify-center rounded-lg border border-primary-600 bg-background-light px-3 py-1.5 text-label-04 text-primary-600 transition-colors",
      "hover:bg-primary-50 active:bg-gray-100",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
      "disabled:cursor-not-allowed disabled:border-border-deactivated disabled:bg-background-dark disabled:text-text-placeholder",
      className,
    )}
    {...props}
  />
));

SignupOutlineButton.displayName = "SignupOutlineButton";

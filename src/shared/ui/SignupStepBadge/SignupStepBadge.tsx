import { cn } from "@/utils/cn";

export interface SignupStepBadgeProps {
  className?: string;
  active?: boolean;
  step: number | string;
}

export const SignupStepBadge = ({
  className,
  active = false,
  step,
}: SignupStepBadgeProps) => (
  <div
    aria-current={active ? "step" : undefined}
    className={cn(
      "inline-flex size-10 items-center justify-center rounded-full border text-label-05 transition-colors",
      active
        ? "border-primary-600 bg-primary-600 text-text-inverse"
        : "border-border-deactivated bg-background-light text-text-placeholder",
      className,
    )}
  >
    {step}
  </div>
);

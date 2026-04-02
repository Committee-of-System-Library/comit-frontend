import { cn } from "@/utils/cn";

export type AdminStatusTone =
  | "blue"
  | "green"
  | "neutral"
  | "red"
  | "yellow";

interface AdminStatusBadgeProps {
  children: string;
  tone?: AdminStatusTone;
}

const toneClassMap: Record<AdminStatusTone, string> = {
  blue: "border-primary-100 bg-primary-50 text-primary-700",
  green: "border-success-03/30 bg-success-03/10 text-success-01",
  neutral: "border-border-default bg-white text-text-secondary",
  red: "border-error-03/30 bg-error-03/10 text-error-02",
  yellow: "border-warning-03/40 bg-warning-03/15 text-secondary-900",
};

export const AdminStatusBadge = ({
  children,
  tone = "neutral",
}: AdminStatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-1 text-label-06",
      toneClassMap[tone],
    )}
  >
    {children}
  </span>
);

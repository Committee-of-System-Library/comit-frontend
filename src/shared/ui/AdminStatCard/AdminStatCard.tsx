import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

type Accent = "blue" | "mint" | "orange" | "violet";

interface AdminStatCardProps {
  accent?: Accent;
  description: string;
  icon: LucideIcon;
  title: string;
  value: number | string;
}

const accentClassMap: Record<Accent, string> = {
  blue: "border-primary-100 bg-primary-50/70 text-primary-800",
  mint: "border-success-03/30 bg-success-03/10 text-success-01",
  orange: "border-warning-03/50 bg-warning-03/15 text-secondary-900",
  violet: "border-primary-200 bg-white text-primary-1000",
};

export const AdminStatCard = ({
  accent = "blue",
  description,
  icon: Icon,
  title,
  value,
}: AdminStatCardProps) => (
  <article className="rounded-3xl border border-border-deactivated bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-label-04 text-text-secondary">{title}</p>
        <p className="mt-3 text-head-03 text-text-primary">{value}</p>
      </div>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl border",
          accentClassMap[accent],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-5 text-caption-01 text-text-tertiary">{description}</p>
  </article>
);

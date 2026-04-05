import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminQuickActionProps {
  description: string;
  title: string;
  to: string;
}

export const AdminQuickAction = ({
  description,
  title,
  to,
}: AdminQuickActionProps) => (
  <Link
    className="group flex items-center justify-between rounded-2xl border border-border-deactivated bg-white px-5 py-4 transition-colors hover:bg-background-dark"
    to={to}
  >
    <div>
      <p className="text-label-03 text-text-primary">{title}</p>
      <p className="mt-1 text-caption-01 text-text-secondary">{description}</p>
    </div>
    <ArrowRight className="h-5 w-5 text-text-placeholder transition-transform group-hover:translate-x-1" />
  </Link>
);

interface AdminEmptyStateProps {
  description: string;
  title: string;
}

export const AdminEmptyState = ({
  description,
  title,
}: AdminEmptyStateProps) => (
  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-border-default bg-white px-6 text-center">
    <h3 className="text-subtitle-02 text-text-primary">{title}</h3>
    <p className="mt-2 max-w-[320px] text-body-02 text-text-secondary">
      {description}
    </p>
  </div>
);

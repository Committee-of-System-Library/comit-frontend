import { useNavigate } from "react-router-dom";

import { OriErrorState } from "@/shared/ui/OriErrorState/OriErrorState";

interface NetworkErrorPageProps {
  onRetry?: () => void;
}

const NetworkErrorPage = ({ onRetry }: NetworkErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background-dark px-4">
      <OriErrorState
        primaryAction={{
          label: "다시 시도",
          onClick: () => {
            onRetry?.();
          },
          variant: "primary",
        }}
        secondaryAction={{
          label: "랜딩으로 이동",
          onClick: () => navigate("/landing", { replace: true }),
          variant: "secondary",
        }}
        variant="network"
      />
    </main>
  );
};

export default NetworkErrorPage;

import { useNavigate } from "react-router-dom";

import { OriErrorState } from "@/shared/ui/OriErrorState/OriErrorState";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex w-full items-center justify-center py-16">
      <OriErrorState
        primaryAction={{
          label: "홈으로 이동",
          onClick: () => navigate("/", { replace: true }),
          variant: "primary",
        }}
        secondaryAction={{
          label: "이전 페이지",
          onClick: () => navigate(-1),
          variant: "secondary",
        }}
        variant="notFound"
      />
    </main>
  );
};

export default NotFoundPage;

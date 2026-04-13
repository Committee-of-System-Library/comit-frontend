import oriSadImage from "@/assets/Ori_sad.svg";
import oriSurprisedImage from "@/assets/Ori_surprised.svg";
import { Button } from "@/shared/ui/button/Button";
import { cn } from "@/utils/cn";

type OriErrorVariant = "network" | "notFound" | "server";

interface OriErrorAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface OriErrorStateProps {
  variant: OriErrorVariant;
  title?: string;
  description?: string;
  className?: string;
  primaryAction?: OriErrorAction;
  secondaryAction?: OriErrorAction;
}

const VARIANT_META: Record<
  OriErrorVariant,
  { defaultDescription: string; defaultTitle: string; imageSrc: string }
> = {
  network: {
    defaultDescription:
      "네트워크 연결이 불안정해요.\n인터넷 상태를 확인한 뒤 다시 시도해 주세요.",
    defaultTitle: "네트워크 연결 오류",
    imageSrc: oriSadImage,
  },
  notFound: {
    defaultDescription:
      "요청하신 페이지를 찾을 수 없어요.\n주소를 다시 확인하거나 홈으로 이동해 주세요.",
    defaultTitle: "페이지를 찾을 수 없어요",
    imageSrc: oriSurprisedImage,
  },
  server: {
    defaultDescription:
      "현재 서버에 문제가 발생했어요.\n잠시 후 다시 시도해 주세요.",
    defaultTitle: "서버 오류가 발생했어요",
    imageSrc: oriSadImage,
  },
};

export const OriErrorState = ({
  variant,
  title,
  description,
  className,
  primaryAction,
  secondaryAction,
}: OriErrorStateProps) => {
  const meta = VARIANT_META[variant];

  return (
    <section
      className={cn(
        "flex w-full max-w-[640px] flex-col items-center rounded-3xl border border-border-deactivated bg-background-light px-6 py-10 text-center shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]",
        className,
      )}
      role="alert"
    >
      <img
        alt="Comit 오리 마스코트"
        className="h-[168px] w-auto object-contain"
        src={meta.imageSrc}
      />
      <h1 className="mt-6 text-head-03 text-text-primary">
        {title ?? meta.defaultTitle}
      </h1>
      <p className="mt-3 whitespace-pre-line text-body-01 text-text-secondary">
        {description ?? meta.defaultDescription}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {primaryAction ? (
          <Button
            onClick={primaryAction.onClick}
            variant={primaryAction.variant}
          >
            {primaryAction.label}
          </Button>
        ) : null}
        {secondaryAction ? (
          <Button
            onClick={secondaryAction.onClick}
            variant={secondaryAction.variant ?? "secondary"}
          >
            {secondaryAction.label}
          </Button>
        ) : null}
      </div>
    </section>
  );
};

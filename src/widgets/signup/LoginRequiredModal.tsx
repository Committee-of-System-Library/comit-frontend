import { useEffect } from "react";

import defaultMascotImage from "@/assets/Ori_happy.svg";
import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";
import { cn } from "@/utils/cn";

interface LoginRequiredModalProps {
  className?: string;
  message?: string;
  onLogin: () => void;
  open: boolean;
}

export const LoginRequiredModal = ({
  className,
  message = "로그인 이후에 서비스를 이용해주세요",
  onLogin,
  open,
}: LoginRequiredModalProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4",
        className,
      )}
    >
      <div
        aria-modal
        className="relative z-10 w-full max-w-[400px] rounded-xl bg-background-light p-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)]"
        role="dialog"
      >
        <div className="flex flex-col items-center gap-8">
          <p className="text-center text-subtitle-01 text-text-primary">
            {message}
          </p>

          <img
            alt="Comit 마스코트"
            className="h-[228px] w-[163px] object-contain"
            src={defaultMascotImage}
          />

          <WritingButton icon={null} onClick={onLogin} variant="action">
            로그인하러 가기
          </WritingButton>
        </div>
      </div>
    </div>
  );
};

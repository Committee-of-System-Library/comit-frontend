import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ForwardedRef,
  useState,
  useEffect,
} from "react";

import { Share, Link } from "lucide-react";

import { cn } from "@/utils/cn";

type ShareButtonVariant = "default" | "url";

const baseClass =
  "group h-[40px] px-3 border flex items-center justify-center gap-2 rounded-xl";
const variantClassMap: Record<ShareButtonVariant, string> = {
  default:
    "bg-white text-gray-500 hover:bg-background-dark border-border-deactivated transition-colors duration-200",
  url: "bg-white w-[300px] gap-2 hover:bg-background-dark border-border-deactivated transition-colors duration-200",
};

export interface ShareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ShareButtonVariant;
  url?: string;
  onCopyClick?: (url: string) => void;
}

export const ShareButton = forwardRef<HTMLButtonElement, ShareButtonProps>(
  (
    {
      className,
      variant = "default",
      url = "https://github.com/Committee-of-System-Library/knu-cse-comit-client",
      disabled,
      onClick,
      onCopyClick,
      ...props
    },
    ref,
  ) => {
    const [currentVariant, setCurrentVariant] =
      useState<ShareButtonVariant>(variant);

    useEffect(() => {
      setCurrentVariant(variant);
    }, [variant]);

    const handleDefaultClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e);
      setCurrentVariant("url");
    };

    const handleCopyClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onCopyClick) {
        onCopyClick(url);
      } else {
        navigator.clipboard.writeText(url);
        alert("URL이 복사되었습니다.");
      }
      setCurrentVariant("default");
    };

    if (currentVariant === "default") {
      return (
        <button
          ref={ref as ForwardedRef<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          onClick={handleDefaultClick}
          className={cn(
            baseClass,
            variantClassMap.default,
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          aria-label="공유하기"
          {...props}
        >
          <Share className="w-5 h-5" />
          <span className="text-label-05">공유하기</span>
        </button>
      );
    }

    return (
      <div
        ref={ref as ForwardedRef<HTMLDivElement>}
        className={cn(
          baseClass,
          variantClassMap.url,
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <Link className="w-5 h-5 text-gray-500 shrink-0" />
          <span className="text-label-06 text-text-tertiary truncate flex-1 text-left">
            {url}
          </span>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={handleCopyClick}
          className="text-label-05 text-info-01 hover:text-[#006DCC] shrink-0 px-1"
        >
          복사
        </button>
      </div>
    );
  },
);

ShareButton.displayName = "ShareButton";

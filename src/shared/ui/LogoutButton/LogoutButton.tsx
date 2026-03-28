import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export type LogoutButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const LogoutButton = ({ className, ...props }: LogoutButtonProps) => {
  return (
    <button
      className={cn(
        "flex w-[384px] h-[70px] items-center p-4 bg-background-light border border-border-deactivated rounded-xl transition-colors hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center px-1 py-2">
        <span className="text-label-02 text-text-tertiary">로그아웃</span>
      </div>
    </button>
  );
};

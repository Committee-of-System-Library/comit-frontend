import { cn } from "@/utils/cn";

export interface SignupMascotBubbleProps {
  className?: string;
  text?: string;
}

export const SignupMascotBubble = ({
  className,
  text = "꿱🐥",
}: SignupMascotBubbleProps) => (
  <div className={cn("relative inline-flex", className)}>
    <div className="rounded-2xl bg-gray-100 px-6 py-[18px]">
      <p className="text-head-03 text-text-primary">{text}</p>
    </div>
    <div className="absolute top-1/2 -left-[10px] -translate-y-1/2 border-y-[10px] border-r-[10px] border-y-transparent border-r-gray-100" />
  </div>
);

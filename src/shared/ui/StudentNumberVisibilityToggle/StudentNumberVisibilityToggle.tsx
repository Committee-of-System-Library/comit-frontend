import { useState } from "react";

import { cn } from "@/utils/cn";

interface StudentNumberVisibilityToggleProps {
  studentNumber: string;
  initialVisible: boolean;
  className?: string;
  onToggle: (visible: boolean) => void;
}

export const StudentNumberVisibilityToggle = ({
  studentNumber,
  initialVisible,
  className,
  onToggle,
}: StudentNumberVisibilityToggleProps) => {
  const [visible, setVisible] = useState(initialVisible);

  const handleToggle = () => {
    const next = !visible;
    setVisible(next);
    onToggle(next);
  };

  return (
    <div
      className={cn(
        "flex w-[384px] items-center justify-between p-4 bg-background-light border border-border-deactivated rounded-xl",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5 px-1 py-2">
        <span className="text-label-02 text-text-primary">학번 공개</span>
        <span className="text-label-04 text-text-secondary">
          {studentNumber}
        </span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={visible}
        aria-label="학번 공개 여부 토글"
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
          visible ? "bg-primary-600" : "bg-gray-200",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
            visible ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
};

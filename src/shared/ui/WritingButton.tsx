import { PencilLine } from "lucide-react";

interface WritingButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const WritingButton = ({ disabled = false }: WritingButtonProps) => {
  return (
    <button
      disabled={disabled}
      className="group w-full h-12 py-3.25 flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-1000 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <PencilLine className="w-5 h-5 text-text-inverse group-hover:text-text-deactivated transition-colors duration-200" />
      <p className="text-label-01 text-text-inverse group-hover:text-text-deactivated transition-colors duration-200">
        글 작성하기
      </p>
    </button>
  );
};

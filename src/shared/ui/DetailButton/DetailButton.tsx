import { EllipsisVertical } from "lucide-react";

interface DetailButtonProps {
  onClick: () => void; // 모달 여닫기 대비
}
export const DetailButton = ({ onClick }: DetailButtonProps) => {
  return (
    <button
      aria-label="detail button"
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200"
    >
      <EllipsisVertical className="w-4 h-4 text-gray-500" />
    </button>
  );
};

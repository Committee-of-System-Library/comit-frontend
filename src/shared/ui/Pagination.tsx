import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageGroupSize?: number; // 최대 페이지수 변경 상황 대비
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageGroupSize = 5,
}: PaginationProps) {
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  if (totalPages <= 0) return null;

  return (
    <nav
      aria-label="게시글 페이지네이션"
      className="flex items-center justify-center gap-4 mt-10"
    >
      <button
        onClick={() => onPageChange(startPage - 1)}
        disabled={currentGroup === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-deactivated bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer transition-colors"
        aria-label="이전 페이지 그룹으로 이동"
      >
        <ChevronLeft size={24} className="text-gray-500" aria-hidden="true" />
      </button>
      <div className="flex gap-4">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-10 h-10 rounded-xl border text-label-04 transition-all duration-200 cursor-pointer",
              currentPage === page
                ? "bg-secondary-700 border-secondary-700 text-text-inverse"
                : "bg-white text-gray-500 border-border-deactivated hover:border-secondary-700 hover:text-secondary-700",
            )}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(endPage + 1)}
        disabled={endPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-deactivated bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer transition-colors"
        aria-label="다음 페이지 그룹으로 이동"
      >
        <ChevronRight size={24} className="text-gray-500" aria-hidden="true" />
      </button>
    </nav>
  );
}

import { useState, type ChangeEvent, type FormEvent } from "react";

import { Search } from "lucide-react";

import { cn } from "@/utils/cn";

interface SearchLongProps {
  disabled?: boolean;
  onSearch?: (value: string) => void;
}

export function SearchLong({ disabled = false, onSearch }: SearchLongProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const isActivated = searchTerm.trim().length > 0 && !disabled;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!disabled && onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <search className="w-full" aria-label="게시판 검색">
      <form className="relative flex items-center" onSubmit={handleSubmit}>
        <label htmlFor="board-search" className="sr-only">
          게시판 검색
        </label>
        <input
          id="board-search"
          type="search"
          value={searchTerm}
          onChange={handleChange}
          disabled={disabled}
          placeholder="게시판에 궁금한 걸 검색해 보세요"
          className={cn(
            "w-full h-12 pl-6 pr-14 rounded-full border border-border-deactivated bg-white outline-none transition-all duration-200 placeholder:text-label-01 placeholder:text-text-placeholder",
            isActivated && "border-primary-600 border-2 text-primary-600",
            disabled && "bg-gray-50 cursor-not-allowed opacity-50",
          )}
        />
        <button
          type="submit"
          disabled={disabled}
          aria-label="검색"
          className="absolute right-6 flex items-center justify-center disabled:cursor-not-allowed"
        >
          <Search
            size={24}
            className={cn(
              "transition-colors duration-200",
              isActivated ? "text-primary-600" : "text-gray-500",
            )}
          />
        </button>
      </form>
    </search>
  );
}

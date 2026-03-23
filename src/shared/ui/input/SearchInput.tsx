import { forwardRef, type InputHTMLAttributes } from "react";

import { Search } from "lucide-react";

import { cn } from "@/shared/utils/cn";

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <div className={cn("relative w-full", containerClassName)}>
      <input
        ref={ref}
        type="search"
        className={cn(
          "h-10 w-full rounded-full border border-gray-200 bg-gray-100 px-4 pr-10 text-sm text-gray-700 placeholder:text-gray-500",
          "focus:border-primary-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100",
          "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
          className,
        )}
        {...props}
      />
      <Search
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500"
      />
    </div>
  ),
);

SearchInput.displayName = "SearchInput";

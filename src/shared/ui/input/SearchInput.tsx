import {
  forwardRef,
  type FocusEvent,
  type InputHTMLAttributes,
  useState,
} from "react";

import { Search } from "lucide-react";

import { cn } from "@/utils/cn";

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  containerClassName?: string;
  state?: "default" | "typing";
  typingText?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      containerClassName,
      state = "default",
      typingText = "입력중...",
      onBlur,
      onFocus,
      placeholder = "검색어를 입력하세요",
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const isTyping = state === "typing" || isFocused;

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <input
          ref={ref}
          type="search"
          className={cn(
            className,
            "h-10 w-[417px] rounded-full border border-transparent bg-gray-50 px-4 pr-10 text-label-04 focus:border-primary-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
            isTyping
              ? "border-primary-600 text-text-primary placeholder:text-primary-600"
              : "text-text-primary placeholder:text-text-placeholder",
          )}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={isTyping ? typingText : placeholder}
          {...props}
        />
        <Search
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-[14px] top-1/2 size-4 -translate-y-1/2",
            isTyping ? "text-primary-600" : "text-gray-500",
          )}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

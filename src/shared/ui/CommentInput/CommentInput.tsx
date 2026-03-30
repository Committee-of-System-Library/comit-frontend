import { useState, type ChangeEvent, type FormEvent } from "react";

import { cn } from "@/utils/cn";

interface CommentInputProps {
  disabled?: boolean;
  onSubmit?: (value: string) => void;
}

export function CommentInput({
  disabled = false,
  onSubmit,
}: CommentInputProps) {
  const [comment, setComment] = useState("");

  const isActivated = comment.trim().length > 0 && !disabled;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isActivated && onSubmit) {
      onSubmit(comment.trim());
      setComment("");
    }
  };

  return (
    <div className="w-full">
      <form className="relative flex items-center pr-4" onSubmit={handleSubmit}>
        <label htmlFor="comment-input" className="sr-only">
          댓글 입력
        </label>
        <input
          id="comment-input"
          type="text"
          value={comment}
          onChange={handleChange}
          disabled={disabled}
          placeholder="생각을 남겨보세요"
          className={cn(
            "w-full h-14 pl-4 pr-28 rounded-full border border-border-deactivated bg-white outline-none transition-all duration-200 placeholder:text-label-04 placeholder:text-text-placeholder",
            isActivated && "border-primary-600 border-2 text-text-primary",
            disabled && "bg-gray-50 cursor-not-allowed opacity-50",
          )}
        />
        <button
          type="submit"
          disabled={!isActivated}
          aria-label="댓글 등록"
          className="absolute right-6 px-4 py-2 rounded-[100px] text-label-03 text-text-inverse disabled:bg-primary-300 bg-primary-600 hover:bg-primary-1000 flex items-center justify-center disabled:cursor-not-allowed transition-colors duration-200"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}

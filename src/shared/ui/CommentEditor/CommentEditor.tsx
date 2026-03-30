import { useState, type ChangeEvent, type FormEvent } from "react";

import { cn } from "@/utils/cn";

type ReplyMode = "reply" | "edit";

interface CommentEditorProps {
  mode?: ReplyMode;
  originContent?: string;
  disabled?: boolean;
  onReply?: (value: string) => void;
  onEdit?: (value: string) => void;
  onCancel?: () => void;
}

export function CommentEditor({
  mode = "reply",
  originContent = "",
  disabled = false,
  onReply,
  onEdit,
  onCancel,
}: CommentEditorProps) {
  const [content, setContent] = useState(originContent);

  const isActivated = content.trim().length > 0 && !disabled;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isActivated) return;

    if (mode == "reply" && onReply) {
      onReply(content.trim());
    } else if (mode == "edit" && onEdit) {
      onEdit(content.trim());
    }
    onCancel?.();
  };

  return (
    <div className="w-full">
      <form className="relative flex items-center pr-4" onSubmit={handleSubmit}>
        <label htmlFor="comment-editor" className="sr-only">
          {mode === "reply" ? "답글 입력창" : "댓글/답글 수정창"}
        </label>
        <input
          id="comment-input"
          type="text"
          value={content}
          onChange={handleChange}
          disabled={disabled}
          placeholder={mode === "reply" ? "답글을 남겨보세요" : ""}
          className={cn(
            "text-label-04 w-full h-10 pl-4 pr-36 rounded-full bg-gray-100 outline-none placeholder:text-label-04 placeholder:text-text-deactivated",
            isActivated && "text-text-primary",
            disabled && "cursor-not-allowed opacity-50",
          )}
        />
        <div className="absolute right-6 flex items-center gap-1">
          <button
            type="button"
            aria-label="취소"
            onClick={onCancel}
            disabled={disabled}
            className="px-3 py-1.5 rounded-[100px] border border-primary-600 text-label-06 text-primary-600 bg-background-light hover:bg-gray-100 flex items-center justify-center disabled:cursor-not-allowed  transition-colors duration-200"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!isActivated}
            aria-label={mode === "reply" ? "등록" : "수정"}
            className="px-3 py-1.5 rounded-[100px] text-label-06 text-text-inverse disabled:bg-primary-300 bg-primary-600 hover:bg-primary-1000 flex items-center justify-center disabled:cursor-not-allowed transition-colors duration-200"
          >
            {mode === "reply" ? "등록" : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
}

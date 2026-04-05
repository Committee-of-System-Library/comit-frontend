import type { BoardSelectOption } from "@/shared/ui/BoardSelectField/BoardSelectField";

export const writeBoardOptions: BoardSelectOption[] = [
  { label: "Q&A 게시판", value: "qna" },
  { label: "정보게시판", value: "info" },
  { label: "자유게시판", value: "free" },
];

export const WRITE_POST_MAX_TITLE_LENGTH = 30;
export const WRITE_POST_MAX_CONTENT_LENGTH = 500;
export const WRITE_POST_MAX_TAG_COUNT = 5;
export const WRITE_POST_MAX_IMAGE_COUNT = 5;

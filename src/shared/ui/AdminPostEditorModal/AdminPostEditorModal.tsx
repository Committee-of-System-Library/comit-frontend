import { useState } from "react";

import { createPortal } from "react-dom";

import { BoardSelectField } from "@/shared/ui/BoardSelectField/BoardSelectField";
import { Button } from "@/shared/ui/button/Button";
import { WriteTextareaField } from "@/shared/ui/WriteTextareaField/WriteTextareaField";
import { WriteTextInput } from "@/shared/ui/WriteTextInput/WriteTextInput";
import type {
  AdminEditableBoardType,
  AdminPostDetail,
  AdminPostPayload,
} from "@/types/admin";

interface AdminPostEditorModalProps {
  detail?: AdminPostDetail | null;
  errorMessage?: string | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (payload: AdminPostPayload) => void;
  open: boolean;
}

const BOARD_OPTIONS: Array<{ label: string; value: AdminEditableBoardType }> = [
  { label: "공지사항", value: "NOTICE" },
  { label: "이벤트", value: "EVENT" },
  { label: "정보게시판", value: "INFO" },
];

const DEFAULT_BOARD_TYPE: AdminEditableBoardType = "EVENT";

const joinList = (values: string[]) => values.join(", ");

const parseList = (value: string) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

export const AdminPostEditorModal = ({
  detail,
  errorMessage,
  isLoading = false,
  isSubmitting = false,
  mode,
  onClose,
  onSubmit,
  open,
}: AdminPostEditorModalProps) => {
  const portalRoot = document.getElementById("modal-portal");
  const initialValue =
    mode === "edit" && detail
      ? {
          boardType: detail.boardType,
          content: detail.content,
          imageUrlsInput: detail.imageUrls.join("\n"),
          tagsInput: joinList(detail.tags),
          title: detail.title,
        }
      : {
          boardType: DEFAULT_BOARD_TYPE,
          content: "",
          imageUrlsInput: "",
          tagsInput: "",
          title: "",
        };
  const [boardType, setBoardType] = useState<AdminEditableBoardType>(
    initialValue.boardType,
  );
  const [title, setTitle] = useState(initialValue.title);
  const [content, setContent] = useState(initialValue.content);
  const [tagsInput, setTagsInput] = useState(initialValue.tagsInput);
  const [imageUrlsInput, setImageUrlsInput] = useState(
    initialValue.imageUrlsInput,
  );

  if (!portalRoot || !open) {
    return null;
  }

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-6 sm:items-center">
      <section className="flex max-h-[calc(100dvh-3rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4">
          <div>
            <h2 className="text-subtitle-01 text-text-primary">
              {mode === "create" ? "관리자 게시글 등록" : "관리자 게시글 수정"}
            </h2>
            <p className="mt-1 text-body-02 text-text-secondary">
              공지사항, 이벤트, 정보게시판 게시글을 직접 등록하거나 수정할 수
              있습니다.
            </p>
          </div>
          <Button onClick={onClose} variant="secondary">
            닫기
          </Button>
        </div>

        {mode === "edit" && isLoading ? (
          <div className="mt-8 rounded-2xl border border-border-deactivated bg-background-dark px-4 py-10 text-center text-body-02 text-text-secondary">
            게시글 상세를 불러오는 중입니다.
          </div>
        ) : errorMessage ? (
          <div className="mt-8 rounded-2xl border border-error-03/30 bg-error-03/10 px-4 py-10 text-center text-body-02 text-error-02">
            {errorMessage}
          </div>
        ) : (
          <div className="mt-8 flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
              <BoardSelectField
                label="게시판"
                onChange={(value) =>
                  setBoardType(value as AdminEditableBoardType)
                }
                options={BOARD_OPTIONS}
                value={boardType}
              />

              <WriteTextInput
                label="제목"
                maxLength={100}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="게시글 제목을 입력해 주세요"
                showCount
                value={title}
              />

              <WriteTextareaField
                label="내용"
                maxLength={5000}
                onChange={(event) => setContent(event.target.value)}
                placeholder="게시글 본문을 입력해 주세요"
                rows={8}
                value={content}
              />

              <WriteTextInput
                helperText="쉼표(,) 또는 줄바꿈으로 여러 태그를 입력할 수 있습니다."
                label="태그"
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="예: 세미나, 공지"
                value={tagsInput}
              />

              <WriteTextareaField
                helperText="이미지 URL이 있다면 한 줄에 하나씩 입력해 주세요."
                label="이미지 URL"
                onChange={(event) => setImageUrlsInput(event.target.value)}
                placeholder="https://..."
                rows={3}
                showCount={false}
                value={imageUrlsInput}
              />
            </div>

            <div className="mt-5 flex shrink-0 justify-end gap-2 border-t border-border-deactivated pt-4">
              <Button onClick={onClose} variant="secondary">
                취소
              </Button>
              <Button
                disabled={!canSubmit || isSubmitting}
                onClick={() =>
                  onSubmit({
                    boardType,
                    content: content.trim(),
                    imageUrls: parseList(imageUrlsInput),
                    tags: parseList(tagsInput),
                    title: title.trim(),
                  })
                }
              >
                {isSubmitting
                  ? mode === "create"
                    ? "등록 중..."
                    : "수정 중..."
                  : mode === "create"
                    ? "등록"
                    : "수정"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>,
    portalRoot,
  );
};

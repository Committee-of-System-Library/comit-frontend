import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { createPortal } from "react-dom";

import toast from "react-hot-toast";

import {
  uploadImagesWithPresignedUrl,
  validateImageFiles,
} from "@/features/image/model/imageUpload";
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
  onSubmit: (payload: AdminPostPayload) => Promise<void>;
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
  const [boardType, setBoardType] =
    useState<AdminEditableBoardType>(DEFAULT_BOARD_TYPE);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [imageUrlsInput, setImageUrlsInput] = useState("");
  const [attachedImageFiles, setAttachedImageFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit") {
      if (!detail) {
        return;
      }

      setBoardType(detail.boardType);
      setTitle(detail.title);
      setContent(detail.content);
      setTagsInput(joinList(detail.tags));
      setImageUrlsInput(detail.imageUrls.join("\n"));
    } else {
      setBoardType(DEFAULT_BOARD_TYPE);
      setTitle("");
      setContent("");
      setTagsInput("");
      setImageUrlsInput("");
    }

    setAttachedImageFiles([]);
    setIsUploadingImages(false);
  }, [detail, mode, open]);

  if (!portalRoot || !open) {
    return null;
  }

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const handleClickAttachImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const errorMessage = validateImageFiles(files);
    if (errorMessage) {
      toast.error(errorMessage);
      event.target.value = "";
      return;
    }

    setAttachedImageFiles((prev) => {
      const keyOf = (file: File) =>
        `${file.name}-${file.size}-${file.lastModified}`;
      const existingKeys = new Set(prev.map(keyOf));
      const dedupedNewFiles = files.filter(
        (file) => !existingKeys.has(keyOf(file)),
      );
      return [...prev, ...dedupedNewFiles];
    });
    event.target.value = "";
  };

  const handleRemoveAttachedImage = (index: number) => {
    setAttachedImageFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting || isUploadingImages) {
      return;
    }

    setIsUploadingImages(true);
    let uploadedImageUrls: string[] = [];
    try {
      uploadedImageUrls =
        attachedImageFiles.length > 0
          ? await uploadImagesWithPresignedUrl(attachedImageFiles, "posts")
          : [];
    } catch (error) {
      if (error instanceof Error && error.message.includes("이미지 업로드")) {
        toast.error(
          "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
      setIsUploadingImages(false);
      return;
    }

    const imageUrls = Array.from(
      new Set([...parseList(imageUrlsInput), ...uploadedImageUrls]),
    );

    try {
      await onSubmit({
        boardType,
        content: content.trim(),
        imageUrls,
        tags: parseList(tagsInput),
        title: title.trim(),
      });
    } finally {
      setIsUploadingImages(false);
    }
  };

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
                maxLength={500}
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
                helperText="이미지 URL이 있다면 한 줄에 하나씩 입력하거나, 아래 이미지 첨부 버튼으로 업로드할 수 있습니다."
                label="이미지 URL"
                onChange={(event) => setImageUrlsInput(event.target.value)}
                placeholder="https://..."
                rows={3}
                showCount={false}
                value={imageUrlsInput}
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    disabled={isSubmitting || isUploadingImages}
                    onClick={handleClickAttachImage}
                    variant="secondary"
                  >
                    이미지 첨부
                  </Button>
                  <span className="text-caption-01 text-text-secondary">
                    {attachedImageFiles.length}개 선택됨
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  className="hidden"
                  multiple
                  onChange={handleImageFileChange}
                  type="file"
                />
                {attachedImageFiles.length > 0 ? (
                  <ul className="rounded-xl border border-border-deactivated bg-background-dark p-3">
                    {attachedImageFiles.map((file, index) => (
                      <li
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="truncate text-caption-01 text-text-primary">
                          {file.name}
                        </span>
                        <button
                          className="ml-3 text-caption-02 text-error-02 hover:opacity-80"
                          onClick={() => handleRemoveAttachedImage(index)}
                          type="button"
                        >
                          제거
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex shrink-0 justify-end gap-2 border-t border-border-deactivated pt-4">
              <Button onClick={onClose} variant="secondary">
                취소
              </Button>
              <Button
                disabled={!canSubmit || isSubmitting || isUploadingImages}
                onClick={() => {
                  void handleSubmit();
                }}
              >
                {isUploadingImages
                  ? "이미지 업로드 중..."
                  : isSubmitting
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

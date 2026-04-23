import { useCallback, useEffect, useMemo, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { WRITE_POST_PRESET_TAGS } from "@/constants/writeTags";
import type { BoardType } from "@/entities/post/model/types";
import {
  uploadImagesWithPresignedUrl,
  validateImageFiles,
} from "@/features/image/model/imageUpload";
import { normalizePostDomainError } from "@/features/post/model/postDomainError";
import { resolvePostDomainErrorMessage } from "@/features/post/model/postDomainErrorMessage";
import { useCreatePostMutation } from "@/features/post/model/useCreatePostMutation";
import { usePostDetailQuery } from "@/features/post/model/usePostDetailQuery";
import { useUpdatePostMutation } from "@/features/post/model/useUpdatePostMutation";
import {
  WRITE_POST_MAX_CONTENT_LENGTH,
  WRITE_POST_MAX_IMAGE_COUNT,
  WRITE_POST_MAX_TAG_COUNT,
  WRITE_POST_MAX_TITLE_LENGTH,
  writeBoardOptions,
} from "@/mocks/writeForm";
import { BoardSelectField } from "@/shared/ui/BoardSelectField/BoardSelectField";
import {
  WriteImageUploadField,
  type WriteImageUploadItem,
} from "@/shared/ui/WriteImageUploadField/WriteImageUploadField";
import { WriteTagInputField } from "@/shared/ui/WriteTagInputField/WriteTagInputField";
import { WriteTextareaField } from "@/shared/ui/WriteTextareaField/WriteTextareaField";
import { WriteTextInput } from "@/shared/ui/WriteTextInput/WriteTextInput";
import { WritingButton } from "@/shared/ui/WritingButton/WritingButton";

const writePostFormSchema = z.object({
  board: z.string().min(1, "게시판은 반드시 선택해야 합니다"),
  title: z
    .string()
    .trim()
    .min(1, "제목은 필수로 입력해야 합니다")
    .max(
      WRITE_POST_MAX_TITLE_LENGTH,
      `제목은 최대 ${WRITE_POST_MAX_TITLE_LENGTH}자까지 입력 가능합니다`,
    ),
  content: z
    .string()
    .trim()
    .min(1, "내용은 필수로 입력해야 합니다")
    .max(
      WRITE_POST_MAX_CONTENT_LENGTH,
      `본문은 최대 ${WRITE_POST_MAX_CONTENT_LENGTH}자까지 입력 가능합니다`,
    ),
  tags: z
    .array(z.string())
    .max(
      WRITE_POST_MAX_TAG_COUNT,
      `태그는 최대 ${WRITE_POST_MAX_TAG_COUNT}개까지 입력 가능합니다`,
    ),
  images: z
    .array(z.custom<WriteImageUploadItem>())
    .max(
      WRITE_POST_MAX_IMAGE_COUNT,
      `이미지는 최대 ${WRITE_POST_MAX_IMAGE_COUNT}장까지 업로드 가능합니다`,
    ),
});

type WritePostFormValues = z.infer<typeof writePostFormSchema>;

const API_FIELD_TO_FORM_FIELD: Partial<
  Record<string, keyof WritePostFormValues>
> = {
  boardType: "board",
  content: "content",
  imageUrls: "images",
  tags: "tags",
  title: "title",
};

const BOARD_TYPE_MAP: Record<string, BoardType> = {
  event: "EVENT",
  free: "FREE",
  info: "INFO",
  notice: "NOTICE",
  qna: "QNA",
};

const BOARD_TYPE_REVERSE_MAP: Partial<Record<string, string>> = {
  EVENT: "event",
  FREE: "free",
  INFO: "info",
  NOTICE: "notice",
  QNA: "qna",
};

const BOARD_VALUE_LABEL_MAP: Record<string, string> = {
  event: "이벤트",
  free: "자유게시판",
  info: "정보게시판",
  notice: "공지사항",
  qna: "Q&A 게시판",
};

const createUploadItems = (selectedFiles: File[]) =>
  selectedFiles.map<WriteImageUploadItem>((file) => ({
    file,
    id: `${file.name}-${file.lastModified}-${file.size}`,
    name: file.name,
    sizeLabel: `${Math.max(1, Math.ceil(file.size / 1024))}KB`,
    thumbnailUrl: URL.createObjectURL(file),
  }));

const revokePreviewUrl = (thumbnailUrl?: string) => {
  if (thumbnailUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(thumbnailUrl);
  }
};

type ContentFormatAction =
  | "heading1"
  | "heading2"
  | "bold"
  | "blue"
  | "red"
  | "list"
  | "quote";

const FORMAT_TOOLBAR_ITEMS: Array<{
  action: ContentFormatAction;
  label: string;
}> = [
  { action: "heading1", label: "H1" },
  { action: "heading2", label: "H2" },
  { action: "bold", label: "굵게" },
  { action: "blue", label: "파랑" },
  { action: "red", label: "빨강" },
  { action: "list", label: "목록" },
  { action: "quote", label: "인용" },
];

const WritePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editPostIdParam = searchParams.get("postId");
  const editPostId = editPostIdParam ? Number(editPostIdParam) : null;
  const isEditMode =
    editPostId !== null && Number.isInteger(editPostId) && editPostId > 0;

  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePostMutation();
  const { mutateAsync: updatePost, isPending: isUpdatingPost } =
    useUpdatePostMutation();
  const { data: existingPost } = usePostDetailQuery({
    postId: editPostId ?? 0,
    enabled: isEditMode,
  });

  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    reset,
    setError,
    setValue,
  } = useForm<WritePostFormValues>({
    defaultValues: {
      board: "",
      title: "",
      content: "",
      tags: [],
      images: [],
    },
    resolver: zodResolver(writePostFormSchema),
  });

  const currentTags = useWatch({ control, name: "tags", defaultValue: [] });
  const currentImages = useWatch({
    control,
    name: "images",
    defaultValue: [],
  });
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const imageItemsRef = useRef<WriteImageUploadItem[]>(currentImages);

  useEffect(() => {
    imageItemsRef.current = currentImages;
  }, [currentImages]);

  useEffect(() => {
    return () => {
      imageItemsRef.current.forEach((image) =>
        revokePreviewUrl(image.thumbnailUrl),
      );
    };
  }, []);

  useEffect(() => {
    if (isEditMode && existingPost) {
      const existingImages = (existingPost.imageUrls ?? []).map((url) => ({
        id: url,
        name: url.split("/").pop() ?? "image",
        thumbnailUrl: url,
      }));

      reset({
        board: BOARD_TYPE_REVERSE_MAP[existingPost.boardType] ?? "",
        title: existingPost.title,
        content: existingPost.content,
        tags: existingPost.tags ?? [],
        images: existingImages,
      });
    }
  }, [existingPost, isEditMode, reset]);

  const resolvedWriteBoardOptions = useMemo(() => {
    if (!isEditMode || !existingPost) {
      return writeBoardOptions;
    }

    const editBoardValue = BOARD_TYPE_REVERSE_MAP[existingPost.boardType];

    if (!editBoardValue) {
      return writeBoardOptions;
    }

    const hasBoardOption = writeBoardOptions.some(
      (option) => option.value === editBoardValue,
    );

    if (hasBoardOption) {
      return writeBoardOptions;
    }

    return [
      ...writeBoardOptions,
      {
        label: BOARD_VALUE_LABEL_MAP[editBoardValue] ?? editBoardValue,
        value: editBoardValue,
      },
    ];
  }, [existingPost, isEditMode]);

  const handleToggleTag = (tag: string) => {
    const previousTags = getValues("tags");
    const isSelected = previousTags.includes(tag);

    if (isSelected) {
      const nextTags = previousTags.filter((item) => item !== tag);

      setValue("tags", nextTags, {
        shouldDirty: true,
        shouldValidate: true,
      });

      clearErrors("tags");
      return;
    }

    if (previousTags.length >= WRITE_POST_MAX_TAG_COUNT) {
      setError("tags", {
        type: "manual",
        message: `태그는 최대 ${WRITE_POST_MAX_TAG_COUNT}개까지 입력 가능합니다`,
      });
      return;
    }

    setValue("tags", [...previousTags, tag], {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors("tags");
  };

  const handleFilesSelect = (files: FileList) => {
    const selectedFiles = Array.from(files);
    const previousImages = getValues("images");
    const remainCount = WRITE_POST_MAX_IMAGE_COUNT - previousImages.length;

    if (remainCount <= 0) {
      setError("images", {
        type: "manual",
        message: `이미지는 최대 ${WRITE_POST_MAX_IMAGE_COUNT}장까지 업로드 가능합니다`,
      });
      return;
    }

    const invalidImageMessage = validateImageFiles(selectedFiles);

    if (invalidImageMessage) {
      setError("images", {
        type: "manual",
        message: invalidImageMessage,
      });
      return;
    }

    const acceptedFiles = selectedFiles.slice(0, remainCount);
    const nextImages = [...previousImages, ...createUploadItems(acceptedFiles)];

    setValue("images", nextImages, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (selectedFiles.length > remainCount) {
      setError("images", {
        type: "manual",
        message: `이미지는 최대 ${WRITE_POST_MAX_IMAGE_COUNT}장까지 업로드 가능합니다`,
      });
      return;
    }

    clearErrors("images");
  };

  const handleRemoveImage = (id: string) => {
    const previousImages = getValues("images");
    const removedImage = previousImages.find((image) => image.id === id);
    const nextImages = previousImages.filter((image) => image.id !== id);

    revokePreviewUrl(removedImage?.thumbnailUrl);

    setValue("images", nextImages, {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors("images");
  };

  const applyWrappedFormat = useCallback(
    (
      action: "bold" | "blue" | "red",
      placeholder: string,
      textarea: HTMLTextAreaElement,
    ) => {
      const value = getValues("content");
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const selectedText = value.slice(selectionStart, selectionEnd);
      const text = selectedText || placeholder;

      const wrapper =
        action === "bold"
          ? { close: "**", open: "**" }
          : action === "blue"
            ? { close: "[/blue]", open: "[blue]" }
            : { close: "[/red]", open: "[red]" };

      const nextValue =
        value.slice(0, selectionStart) +
        wrapper.open +
        text +
        wrapper.close +
        value.slice(selectionEnd);

      setValue("content", nextValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("content");

      requestAnimationFrame(() => {
        textarea.focus();
        const start = selectionStart + wrapper.open.length;
        const end = start + text.length;
        textarea.setSelectionRange(start, end);
      });
    },
    [clearErrors, getValues, setValue],
  );

  const toggleLinePrefix = useCallback(
    (prefix: string, textarea: HTMLTextAreaElement) => {
      const value = getValues("content");
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const start = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const endLineBreak = value.indexOf("\n", selectionEnd);
      const end = endLineBreak === -1 ? value.length : endLineBreak;
      const selectedBlock = value.slice(start, end);
      const lines = selectedBlock.split("\n");
      const shouldRemovePrefix = lines
        .filter((line) => line.trim().length > 0)
        .every((line) => line.startsWith(prefix));

      const nextLines = lines.map((line) => {
        if (!line.trim()) {
          return line;
        }

        if (shouldRemovePrefix) {
          return line.startsWith(prefix) ? line.slice(prefix.length) : line;
        }

        return `${prefix}${line}`;
      });

      const nextBlock = nextLines.join("\n");
      const nextValue = value.slice(0, start) + nextBlock + value.slice(end);

      setValue("content", nextValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("content");

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + nextBlock.length);
      });
    },
    [clearErrors, getValues, setValue],
  );

  const handleApplyContentFormat = (action: ContentFormatAction) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) {
      return;
    }

    switch (action) {
      case "bold":
        applyWrappedFormat("bold", "강조 텍스트", textarea);
        return;
      case "blue":
        applyWrappedFormat("blue", "파란 텍스트", textarea);
        return;
      case "red":
        applyWrappedFormat("red", "빨간 텍스트", textarea);
        return;
      case "heading1":
        toggleLinePrefix("# ", textarea);
        return;
      case "heading2":
        toggleLinePrefix("## ", textarea);
        return;
      case "list":
        toggleLinePrefix("- ", textarea);
        return;
      case "quote":
        toggleLinePrefix("> ", textarea);
        return;
      default:
        return;
    }
  };

  const onSubmit = async (values: WritePostFormValues) => {
    if (isEditMode) {
      try {
        const existingImageUrls = values.images
          .filter((item) => !item.file)
          .map((item) => item.thumbnailUrl!);

        const newFiles = values.images
          .filter((item) => !!item.file)
          .map((item) => item.file!);

        const newImageUrls =
          newFiles.length > 0
            ? await uploadImagesWithPresignedUrl(newFiles, "posts")
            : [];

        await updatePost({
          postId: editPostId!,
          payload: {
            title: values.title.trim(),
            content: values.content.trim(),
            tags: values.tags,
            imageUrls: [...existingImageUrls, ...newImageUrls],
          },
        });
        toast.success("게시글이 수정되었습니다.");
        navigate(`/post/${editPostId}`);
      } catch (error) {
        const normalizedError = normalizePostDomainError(error);
        toast.error(
          resolvePostDomainErrorMessage(normalizedError, {
            auth: "로그인 후 게시글을 수정할 수 있어요.",
            default: "게시글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.",
            forbidden: "게시글을 수정할 권한이 없습니다.",
            notFound: "게시글을 찾을 수 없습니다.",
          }),
        );
      }
      return;
    }

    const boardType = BOARD_TYPE_MAP[values.board];

    if (!boardType) {
      setError("board", {
        message: "게시판은 반드시 선택해야 합니다",
        type: "manual",
      });
      return;
    }

    try {
      const imageUrls =
        values.images.length > 0
          ? await uploadImagesWithPresignedUrl(
              values.images
                .map((image) => image.file)
                .filter((f): f is File => f !== undefined),
              "posts",
            )
          : [];

      const postId = await createPost({
        boardType,
        imageUrls,
        tags: values.tags,
        title: values.title.trim(),
        content: values.content.trim(),
      });

      values.images.forEach((image) => revokePreviewUrl(image.thumbnailUrl));
      toast.success("게시글이 등록되었습니다.");
      navigate(`/post/${postId}`);
    } catch (error) {
      const normalizedError = normalizePostDomainError(error);

      if (
        normalizedError.code === "FILE_SIZE_EXCEEDED" ||
        normalizedError.code === "UNSUPPORTED_FILE_TYPE" ||
        normalizedError.message ===
          "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요."
      ) {
        setError("images", {
          message: normalizedError.message,
          type: "server",
        });
        return;
      }

      if (normalizedError.kind === "validation") {
        let hasMappedField = false;

        normalizedError.invalidFields?.forEach((invalidField) => {
          const fieldName = API_FIELD_TO_FORM_FIELD[invalidField.field];

          if (!fieldName) {
            return;
          }

          hasMappedField = true;
          setError(fieldName, {
            message: invalidField.message,
            type: "server",
          });
        });

        if (hasMappedField) {
          return;
        }
      }

      toast.error(
        resolvePostDomainErrorMessage(normalizedError, {
          auth: "로그인 후 게시글을 작성할 수 있어요.",
          default: "게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.",
          forbidden: "게시글을 작성할 권한이 없습니다.",
        }),
      );
    }
  };

  return (
    <section className="w-full space-y-10">
      <h1 className="w-full text-head-02 text-text-primary">
        {isEditMode ? "글 수정하기" : "글 작성하기"}
      </h1>

      <form
        className="flex flex-col gap-8"
        id="write-post-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <Controller
            control={control}
            name="board"
            render={({ field }) => (
              <BoardSelectField
                className="w-[282px]"
                disabled={isEditMode}
                errorMessage={errors.board?.message}
                inlineError
                label={
                  <>
                    게시판 선택 <span className="text-error-03">*</span>
                  </>
                }
                onChange={field.onChange}
                options={resolvedWriteBoardOptions}
                placeholder="게시판 선택하기"
                value={field.value}
              />
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <WriteTextInput
                {...field}
                errorMessage={errors.title?.message}
                inlineError
                label={
                  <>
                    제목 <span className="text-error-03">*</span>
                  </>
                }
                maxLength={WRITE_POST_MAX_TITLE_LENGTH}
                placeholder="제목을 입력하세요"
                showCount
              />
            )}
          />
        </div>

        <div className="w-full">
          <div className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-border-deactivated bg-background-light p-2">
            {FORMAT_TOOLBAR_ITEMS.map((item) => (
              <button
                key={item.action}
                className="rounded-md border border-border-deactivated bg-white px-2.5 py-1 text-caption-02 text-text-secondary transition-colors hover:bg-gray-50"
                onClick={() => handleApplyContentFormat(item.action)}
                type="button"
              >
                {item.label}
              </button>
            ))}
            <p className="pl-1 text-caption-02 text-text-placeholder">
              예: **굵게**, [blue]파랑[/blue], [red]빨강[/red], # 헤더
            </p>
          </div>

          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <WriteTextareaField
                {...field}
                className="h-60 min-h-60"
                errorMessage={errors.content?.message}
                inlineError
                label="내용"
                maxLength={WRITE_POST_MAX_CONTENT_LENGTH}
                ref={(element) => {
                  contentTextareaRef.current = element;
                  field.ref(element);
                }}
                placeholder="게시판의 성격에 맞지 않는 글은 삭제될 수 있습니다"
              />
            )}
          />
        </div>

        <div className="w-full">
          <WriteTagInputField
            chipClassName="min-w-[78px] justify-center px-2"
            chipPrefix="#"
            availableTags={WRITE_POST_PRESET_TAGS}
            errorMessage={errors.tags?.message}
            inlineError
            label="해시태그 선택"
            maxTags={WRITE_POST_MAX_TAG_COUNT}
            placeholder="게시글당 최대 5개의 태그를 지정할 수 있습니다"
            selectionOnly
            showAddButton={false}
            showCount={false}
            showLeadingPlusIcon
            showRemoveButton
            tags={currentTags}
            onToggleTag={handleToggleTag}
          />
        </div>

        <div className="w-full">
          <WriteImageUploadField
            countText={`${currentImages.length}/${WRITE_POST_MAX_IMAGE_COUNT}`}
            disabled={isSubmitting || isCreatingPost || isUpdatingPost}
            errorMessage={errors.images?.message}
            files={currentImages}
            inlineError
            label="이미지 첨부"
            maxFiles={WRITE_POST_MAX_IMAGE_COUNT}
            onFilesSelect={handleFilesSelect}
            onRemoveFile={handleRemoveImage}
            uploadButtonText="이미지를 드래그하거나 업로드하세요 (PNG, JPG ...)"
          />
        </div>

        <WritingButton
          disabled={isSubmitting || isCreatingPost || isUpdatingPost}
          form="write-post-form"
          icon={null}
          type="submit"
          variant="writing"
        >
          {isEditMode ? "수정 완료" : "작성 완료"}
        </WritingButton>
      </form>
    </section>
  );
};

export default WritePage;

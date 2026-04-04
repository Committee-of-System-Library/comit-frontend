import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { WRITE_POST_PRESET_TAGS } from "@/constants/writeTags";
import type { BoardType } from "@/entities/post/model/types";
import { useCreatePostMutation } from "@/features/post/model/useCreatePostMutation";
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
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        sizeLabel: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      }),
    )
    .max(
      WRITE_POST_MAX_IMAGE_COUNT,
      `이미지는 최대 ${WRITE_POST_MAX_IMAGE_COUNT}장까지 업로드 가능합니다`,
    ),
});

type WritePostFormValues = z.infer<typeof writePostFormSchema>;

const BOARD_TYPE_MAP: Record<string, BoardType> = {
  free: "FREE",
  info: "INFO",
  qna: "QNA",
};

const createUploadItems = (selectedFiles: File[]) =>
  selectedFiles.map<WriteImageUploadItem>((file) => ({
    id: `${file.name}-${file.lastModified}-${file.size}`,
    name: file.name,
    sizeLabel: `${Math.max(1, Math.ceil(file.size / 1024))}KB`,
  }));

const WritePage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreatePostMutation();
  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
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
    const nextImages = getValues("images").filter((image) => image.id !== id);

    setValue("images", nextImages, {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors("images");
  };

  const onSubmit = async (values: WritePostFormValues) => {
    const boardType = BOARD_TYPE_MAP[values.board];

    if (!boardType) {
      setError("board", {
        message: "게시판은 반드시 선택해야 합니다",
        type: "manual",
      });
      return;
    }

    try {
      const postId = await createPost({
        boardType,
        // 이미지 업로드 API가 연결되기 전까지는 URL 배열을 비워 요청합니다.
        imageUrls: [],
        tags: values.tags,
        title: values.title.trim(),
        content: values.content.trim(),
      });

      toast.success("게시글이 등록되었습니다.");
      navigate(`/post/${postId}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      toast.error(message);
    }
  };

  return (
    <section className="w-full space-y-10">
      <h1 className="w-full text-head-02 text-text-primary">글 작성하기</h1>

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
                errorMessage={errors.board?.message}
                inlineError
                label={
                  <>
                    게시판 선택 <span className="text-error-03">*</span>
                  </>
                }
                onChange={field.onChange}
                options={writeBoardOptions}
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
              />
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <WriteTextareaField
                {...field}
                className="h-60 min-h-60"
                label="내용"
                maxLength={WRITE_POST_MAX_CONTENT_LENGTH}
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
            countText={`${currentImages.length}/최대 업로드 용량`}
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
          disabled={isSubmitting || isCreatingPost}
          form="write-post-form"
          icon={null}
          type="submit"
          variant="writing"
        >
          작성 완료
        </WritingButton>
      </form>
    </section>
  );
};

export default WritePage;

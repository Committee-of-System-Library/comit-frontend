import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

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
import { WritingButton } from "@/shared/ui/WritingButton";

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
    .min(10, "본문을 최소 10자 이상 입력해 주세요")
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

const writeTagPreviewChips = [
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
  "해시태그",
];

const createUploadItems = (selectedFiles: File[]) =>
  selectedFiles.map<WriteImageUploadItem>((file) => ({
    id: `${file.name}-${file.lastModified}-${file.size}`,
    name: file.name,
    sizeLabel: `${Math.max(1, Math.ceil(file.size / 1024))}KB`,
  }));

const WritePage = () => {
  const [tagInput, setTagInput] = useState("");

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

  const normalizedTagSet = useMemo(
    () => new Set(currentTags.map((tag) => tag.trim().toLowerCase())),
    [currentTags],
  );

  const handleAddTag = (rawTag: string) => {
    const normalizedTag = rawTag.trim();

    if (!normalizedTag) {
      return;
    }

    if (normalizedTag.length > 20) {
      setError("tags", {
        type: "manual",
        message: "태그는 최대 20자까지 입력 가능합니다",
      });
      return;
    }

    if (normalizedTagSet.has(normalizedTag.toLowerCase())) {
      setError("tags", {
        type: "manual",
        message: "중복 태그는 추가할 수 없습니다",
      });
      return;
    }

    const previousTags = getValues("tags");

    if (previousTags.length >= WRITE_POST_MAX_TAG_COUNT) {
      setError("tags", {
        type: "manual",
        message: `태그는 최대 ${WRITE_POST_MAX_TAG_COUNT}개까지 입력 가능합니다`,
      });
      return;
    }

    setValue("tags", [...previousTags, normalizedTag], {
      shouldDirty: true,
      shouldValidate: true,
    });

    clearErrors("tags");
    setTagInput("");
  };

  const handleRemoveTag = (targetTag: string) => {
    const nextTags = getValues("tags").filter((tag) => tag !== targetTag);

    setValue("tags", nextTags, {
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

  const onSubmit = () => {
    // API 연결 이슈에서 등록 요청 로직을 연결합니다.
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
                errorMessage={errors.content?.message}
                label="내용"
                maxLength={WRITE_POST_MAX_CONTENT_LENGTH}
                placeholder="게시판의 성격에 맞지 않는 글은 삭제될 수 있습니다"
              />
            )}
          />
        </div>

        <div className="w-full">
          <WriteTagInputField
            chipClassName="w-[78px] justify-center"
            chipPrefix="#"
            emptyChips={writeTagPreviewChips}
            errorMessage={errors.tags?.message}
            label="해시태그 선택"
            maxTags={WRITE_POST_MAX_TAG_COUNT}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onValueChange={setTagInput}
            placeholder="게시글당 최대 5개의 태그를 지정할 수 있습니다"
            showAddButton={false}
            showCount={false}
            showLeadingPlusIcon
            showRemoveButton={false}
            tags={currentTags}
            value={tagInput}
          />
        </div>

        <div className="w-full">
          <WriteImageUploadField
            countText={`${currentImages.length}/최대 업로드 용량`}
            errorMessage={errors.images?.message}
            files={currentImages}
            label="이미지 첨부"
            maxFiles={WRITE_POST_MAX_IMAGE_COUNT}
            onFilesSelect={handleFilesSelect}
            onRemoveFile={handleRemoveImage}
            uploadButtonText="이미지를 드래그하거나 업로드하세요 (PNG, JPG ...)"
          />
        </div>

        <WritingButton
          disabled={isSubmitting}
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

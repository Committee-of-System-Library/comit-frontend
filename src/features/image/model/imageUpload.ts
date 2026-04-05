import { requestPresignedUpload } from "@/entities/image/api/requestPresignedUpload";
import type { PresignedUploadFolder } from "@/entities/image/model/types";

export const IMAGE_UPLOAD_MAX_FILE_SIZE = 5 * 1024 * 1024;

export const IMAGE_UPLOAD_ALLOWED_CONTENT_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const IMAGE_UPLOAD_FAILURE_MESSAGE =
  "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.";

export const validateImageFile = (file: File) => {
  if (!IMAGE_UPLOAD_ALLOWED_CONTENT_TYPES.includes(file.type as never)) {
    return "이미지는 JPG, PNG, WEBP, GIF 형식만 업로드할 수 있습니다.";
  }

  if (file.size > IMAGE_UPLOAD_MAX_FILE_SIZE) {
    return "이미지는 5MB 이하만 업로드할 수 있습니다.";
  }

  return null;
};

export const validateImageFiles = (files: readonly File[]) => {
  for (const file of files) {
    const errorMessage = validateImageFile(file);

    if (errorMessage) {
      return errorMessage;
    }
  }

  return null;
};

const uploadFileToPresignedUrl = async (presignedUrl: string, file: File) => {
  const response = await fetch(presignedUrl, {
    body: file,
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error(IMAGE_UPLOAD_FAILURE_MESSAGE);
  }
};

export const uploadImagesWithPresignedUrl = async (
  files: readonly File[],
  folder: PresignedUploadFolder,
) => {
  return Promise.all(
    files.map(async (file) => {
      const { imageUrl, presignedUrl } = await requestPresignedUpload({
        contentType: file.type,
        fileName: file.name,
        folder,
      });

      await uploadFileToPresignedUrl(presignedUrl, file);

      return imageUrl;
    }),
  );
};

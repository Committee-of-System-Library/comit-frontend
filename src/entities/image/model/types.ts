export type PresignedUploadFolder = "members" | "posts";

export interface PresignedUploadRequest {
  contentType: string;
  fileName: string;
  folder: PresignedUploadFolder;
}

export interface PresignedUploadResponse {
  imageUrl: string;
  presignedUrl: string;
}

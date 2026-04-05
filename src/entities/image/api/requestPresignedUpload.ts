import type {
  PresignedUploadRequest,
  PresignedUploadResponse,
} from "@/entities/image/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const requestPresignedUpload = (payload: PresignedUploadRequest) => {
  return apiClient.post<PresignedUploadResponse>(
    API_ENDPOINTS.image.presigned,
    {
      body: payload,
    },
  );
};

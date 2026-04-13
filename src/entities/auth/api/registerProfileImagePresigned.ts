import type { PresignedUploadResponse } from "@/entities/image/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

interface RegisterProfileImagePresignedRequest {
  contentType: string;
  fileName: string;
}

export const registerProfileImagePresigned = (
  payload: RegisterProfileImagePresignedRequest,
) => {
  return apiClient.post<PresignedUploadResponse>(
    API_ENDPOINTS.auth.registerProfileImagePresigned,
    {
      body: payload,
    },
  );
};

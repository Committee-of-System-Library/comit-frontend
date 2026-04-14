import type {
  RegisterProfileImagePresignedRequest,
  RegisterProfileImagePresignedResponse,
} from "@/entities/auth/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const requestRegisterProfileImagePresigned = (
  payload: RegisterProfileImagePresignedRequest,
) => {
  return apiClient.post<RegisterProfileImagePresignedResponse>(
    API_ENDPOINTS.auth.registerProfileImagePresigned,
    {
      body: payload,
    },
  );
};

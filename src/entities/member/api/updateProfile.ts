import type { UpdateProfileRequest } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const updateProfile = (payload: UpdateProfileRequest) => {
  return apiClient.patch<void>(API_ENDPOINTS.member.me, {
    body: payload,
  });
};

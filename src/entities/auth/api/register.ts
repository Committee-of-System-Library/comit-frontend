import type { RegisterRequest } from "@/entities/auth/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const register = (payload: RegisterRequest) => {
  return apiClient.post<void>(API_ENDPOINTS.auth.register, {
    body: payload,
  });
};

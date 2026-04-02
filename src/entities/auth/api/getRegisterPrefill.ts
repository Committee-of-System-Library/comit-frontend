import type { RegisterPrefill } from "@/entities/auth/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getRegisterPrefill = () => {
  return apiClient.get<RegisterPrefill>(API_ENDPOINTS.auth.registerPrefill);
};

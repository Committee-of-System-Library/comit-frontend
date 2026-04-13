import type { MyActivity } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getMyActivity = () => {
  return apiClient.get<MyActivity>(API_ENDPOINTS.member.myActivity);
};

import type { MyProfile } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const getMyProfile = () => {
  return apiClient.get<MyProfile>(API_ENDPOINTS.member.me);
};

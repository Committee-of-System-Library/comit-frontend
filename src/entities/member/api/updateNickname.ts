import type { UpdateNicknameRequest } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const updateNickname = (payload: UpdateNicknameRequest) => {
  return apiClient.patch<void>(API_ENDPOINTS.member.me, {
    body: payload,
  });
};

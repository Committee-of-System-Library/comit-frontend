import type { UpdateStudentNumberVisibilityRequest } from "@/entities/member/model/types";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const updateStudentNumberVisibility = (
  payload: UpdateStudentNumberVisibilityRequest,
) => {
  return apiClient.patch<void>(API_ENDPOINTS.member.studentNumberVisibility, {
    body: payload,
  });
};

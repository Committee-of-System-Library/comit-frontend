import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const updateStudentNumberVisibility = (visible: boolean) => {
  return apiClient.patch<void>(API_ENDPOINTS.member.studentNumberVisibility, {
    body: { visible },
  });
};

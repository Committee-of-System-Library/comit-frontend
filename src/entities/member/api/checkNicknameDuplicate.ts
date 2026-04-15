import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

interface CheckNicknameDuplicateParams {
  value: string;
}

export const checkNicknameDuplicate = ({
  value,
}: CheckNicknameDuplicateParams) => {
  return apiClient.get<void>(API_ENDPOINTS.member.nicknameCheck, {
    params: { value },
  });
};

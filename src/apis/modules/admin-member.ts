import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/apis/client";
import type {
  AdminListParams,
  AdminMemberPageResponse,
  AdminMemberStatusPayload,
  MemberStatus,
} from "@/types/admin";

interface AdminMemberListParams extends AdminListParams {
  status?: MemberStatus;
}

interface UpdateMemberStatusParams {
  memberId: number;
  payload: AdminMemberStatusPayload;
}

const adminMemberKeys = {
  all: ["admin", "members"] as const,
  list: (params: AdminMemberListParams) =>
    [...adminMemberKeys.all, params] as const,
};

const getAdminMembers = (params: AdminMemberListParams) =>
  client.get<AdminMemberPageResponse>("/admin/members", { params });

const patchMemberStatus = ({ memberId, payload }: UpdateMemberStatusParams) =>
  client.patch<void>(`/admin/members/${memberId}/status`, payload);

export const useAdminMembers = (params: AdminMemberListParams) =>
  useQuery({
    queryKey: adminMemberKeys.list(params),
    queryFn: () => getAdminMembers(params),
  });

export const usePatchMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchMemberStatus,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminMemberKeys.all });
    },
  });
};

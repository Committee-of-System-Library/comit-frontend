import { useMutation, useQueryClient } from "@tanstack/react-query";

import { register } from "@/entities/auth/api/register";
import { requestRegisterProfileImagePresigned } from "@/entities/auth/api/requestRegisterProfileImagePresigned";
import type { RegisterRequest } from "@/entities/auth/model/types";
import { queryKeys } from "@/shared/api/query-keys";

interface RegisterMutationVariables extends Omit<
  RegisterRequest,
  "profileImageUrl"
> {
  imageFile?: File | null;
}

const uploadFileToPresignedUrl = async (presignedUrl: string, file: File) => {
  const response = await fetch(presignedUrl, {
    body: file,
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      imageFile,
      ...payload
    }: RegisterMutationVariables) => {
      let profileImageUrl: string | undefined;

      if (imageFile) {
        const { imageUrl, presignedUrl } =
          await requestRegisterProfileImagePresigned({
            contentType: imageFile.type,
            fileName: imageFile.name,
          });
        await uploadFileToPresignedUrl(presignedUrl, imageFile);
        profileImageUrl = imageUrl;
      }

      return register({
        ...payload,
        profileImageUrl,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.member.all }),
      ]);
    },
  });
};

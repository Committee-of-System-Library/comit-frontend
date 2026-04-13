import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "@/entities/member/api/updateProfile";
import { uploadImagesWithPresignedUrl } from "@/features/image/model/imageUpload";
import { queryKeys } from "@/shared/api/query-keys";

interface UpdateProfileParams {
  nickname?: string;
  imageFile?: File | null;
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nickname, imageFile }: UpdateProfileParams) => {
      let profileImageUrl: string | undefined;

      if (imageFile) {
        const [uploadedUrl] = await uploadImagesWithPresignedUrl(
          [imageFile],
          "members",
        );
        profileImageUrl = uploadedUrl;
      }

      return updateProfile({ nickname, profileImageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.member.me() });
    },
  });
};

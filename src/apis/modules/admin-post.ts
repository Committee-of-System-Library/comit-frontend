import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/apis/client";
import type {
  AdminListParams,
  AdminPostPageResponse,
  AdminVisibilityPayload,
  BoardType,
} from "@/types/admin";

interface AdminPostListParams extends AdminListParams {
  boardType?: BoardType;
}

interface UpdatePostVisibilityParams {
  payload: AdminVisibilityPayload;
  postId: number;
}

const HIDDEN_POST_COUNT_PAGE_SIZE = 100;

const adminPostKeys = {
  all: ["admin", "posts"] as const,
  hiddenCount: () => [...adminPostKeys.all, "hidden-count"] as const,
  list: (params: AdminPostListParams) =>
    [...adminPostKeys.all, params] as const,
};

const getAdminPosts = (params: AdminPostListParams) =>
  client.get<AdminPostPageResponse>("/admin/posts", { params });

const deletePost = (postId: number) =>
  client.delete<void>(`/admin/posts/${postId}`);

const patchPostVisibility = ({ payload, postId }: UpdatePostVisibilityParams) =>
  client.patch<void>(`/admin/posts/${postId}/visibility`, payload);

const getHiddenPostCount = async () => {
  const firstPage = await getAdminPosts({
    page: 0,
    size: HIDDEN_POST_COUNT_PAGE_SIZE,
  });

  let hiddenCount = firstPage.posts.filter((post) => post.hiddenByAdmin).length;

  if (firstPage.totalPages <= 1) {
    return hiddenCount;
  }

  const remainingPages = Array.from(
    { length: firstPage.totalPages - 1 },
    (_, index) => index + 1,
  );

  const BATCH_SIZE = 5;

  for (let i = 0; i < remainingPages.length; i += BATCH_SIZE) {
    const batch = remainingPages.slice(i, i + BATCH_SIZE);
    const responses = await Promise.all(
      batch.map((page) =>
        getAdminPosts({ page, size: HIDDEN_POST_COUNT_PAGE_SIZE }),
      ),
    );
    responses.forEach((response) => {
      hiddenCount += response.posts.filter((post) => post.hiddenByAdmin).length;
    });
  }

  return hiddenCount;
};

export const useAdminPosts = (params: AdminPostListParams) =>
  useQuery({
    queryKey: adminPostKeys.list(params),
    queryFn: () => getAdminPosts(params),
  });

export const useAdminHiddenPostCount = () =>
  useQuery({
    queryKey: adminPostKeys.hiddenCount(),
    queryFn: getHiddenPostCount,
  });

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPostKeys.all });
    },
  });
};

export const usePatchPostVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPostVisibility,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminPostKeys.all });
    },
  });
};

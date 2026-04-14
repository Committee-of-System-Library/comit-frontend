import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/apis/client";
import type {
  AdminCreatePostResponse,
  AdminPostDetail,
  AdminListParams,
  AdminPostPageResponse,
  AdminPostPayload,
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

interface UpdateAdminPostParams {
  payload: AdminPostPayload;
  postId: number;
}

const HIDDEN_POST_COUNT_PAGE_SIZE = 100;

const adminPostKeys = {
  all: ["admin", "posts"] as const,
  hiddenCount: () => [...adminPostKeys.all, "hidden-count"] as const,
  detail: (postId: number) => [...adminPostKeys.all, "detail", postId] as const,
  list: (params: AdminPostListParams) =>
    [...adminPostKeys.all, params] as const,
};

const createPost = (payload: AdminPostPayload) =>
  client.post<AdminCreatePostResponse>("/admin/posts", payload);

const getAdminPost = (postId: number) =>
  client.get<AdminPostDetail>(`/admin/posts/${postId}`);

const getAdminPosts = (params: AdminPostListParams) =>
  client.get<AdminPostPageResponse>("/admin/posts", { params });

const deletePost = (postId: number) =>
  client.delete<void>(`/admin/posts/${postId}`);

const patchPostVisibility = ({ payload, postId }: UpdatePostVisibilityParams) =>
  client.patch<void>(`/admin/posts/${postId}/visibility`, payload);

const updateAdminPost = ({ payload, postId }: UpdateAdminPostParams) =>
  client.patch<void>(`/admin/posts/${postId}`, payload);

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

export const useAdminPostDetail = (postId: number | null, enabled = true) =>
  useQuery({
    queryKey: adminPostKeys.detail(postId ?? -1),
    queryFn: () => getAdminPost(postId as number),
    enabled: enabled && postId !== null,
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

export const useCreateAdminPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
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

export const useUpdateAdminPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminPost,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminPostKeys.all });
      void queryClient.invalidateQueries({
        queryKey: adminPostKeys.detail(variables.postId),
      });
    },
  });
};

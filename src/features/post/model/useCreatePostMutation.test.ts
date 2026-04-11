import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCreatePostMutation } from "./useCreatePostMutation";

import { createPost } from "@/entities/post/api/createPost";
import type { CreatePostRequest } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/entities/post/api/createPost", () => ({
  createPost: vi.fn(),
}));

interface MockMutationOptions {
  mutationFn: (variables: CreatePostRequest) => Promise<void>;
  onSuccess: (
    data: void,
    variables: CreatePostRequest,
    context: unknown,
  ) => Promise<void>;
}

describe("useCreatePostMutation", () => {
  const mockInvalidateQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    } as never);

    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn() } as never);
  });

  it("mutationFn 실행 시 createPost API를 호출한다", async () => {
    renderHook(() => useCreatePostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockPayload: CreatePostRequest = {
      boardType: "FREE",
      title: "새로운 게시글",
      content: "게시글 내용",
    };

    await options.mutationFn(mockPayload);

    expect(createPost).toHaveBeenCalledTimes(1);
    expect(createPost).toHaveBeenCalledWith(mockPayload);
  });

  it("onSuccess 시 post.all 쿼리를 무효화한다", async () => {
    renderHook(() => useCreatePostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockPayload: CreatePostRequest = {
      boardType: "FREE",
      title: "새로운 게시글",
      content: "게시글 내용",
    };

    await options.onSuccess(undefined, mockPayload, undefined);

    expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.post.all,
    });
  });
});

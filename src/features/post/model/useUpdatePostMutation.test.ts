import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUpdatePostMutation } from "./useUpdatePostMutation";

import { updatePost } from "@/entities/post/api/updatePost";
import type { UpdatePostRequest } from "@/entities/post/model/types";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/entities/post/api/updatePost", () => ({
  updatePost: vi.fn(),
}));

interface MockMutationOptions {
  mutationFn: (variables: {
    postId: number;
    payload: UpdatePostRequest;
  }) => Promise<void>;
  onSuccess: (
    data: void,
    variables: { postId: number; payload: UpdatePostRequest },
    context: unknown,
  ) => Promise<void>;
}

describe("useUpdatePostMutation", () => {
  const mockInvalidateQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    } as never);

    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn() } as never);
  });

  it("mutationFn 실행 시 updatePost API를 호출한다", async () => {
    renderHook(() => useUpdatePostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockParams = {
      postId: 1,
      payload: {
        title: "수정된 제목",
        content: "수정된 내용",
        tags: ["수정"],
      },
    };

    await options.mutationFn(mockParams);

    expect(updatePost).toHaveBeenCalledTimes(1);
    expect(updatePost).toHaveBeenCalledWith(1, {
      title: "수정된 제목",
      content: "수정된 내용",
      tags: ["수정"],
    });
  });

  it("onSuccess 시 post.all 및 post.detail 쿼리를 무효화한다", async () => {
    renderHook(() => useUpdatePostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockVariables = {
      postId: 1,
      payload: { title: "수정된 제목", content: "수정된 내용" },
    };

    await options.onSuccess(undefined, mockVariables, undefined);

    expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);
    expect(mockInvalidateQueries).toHaveBeenNthCalledWith(1, {
      queryKey: queryKeys.post.all,
    });
    expect(mockInvalidateQueries).toHaveBeenNthCalledWith(2, {
      queryKey: queryKeys.post.detail(1),
    });
  });
});

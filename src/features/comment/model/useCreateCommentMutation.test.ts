import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { toast } from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCreateCommentMutation } from "./useCreateCommentMutation";

import { createComment } from "@/entities/comment/api/createComment";
import type {
  CreateCommentRequest,
  CreateCommentResponse,
} from "@/entities/comment/model/types";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/entities/comment/api/createComment", () => ({
  createComment: vi.fn(),
}));

interface MockMutationOptions {
  mutationFn: (variables: {
    postId: number;
    payload: CreateCommentRequest;
  }) => Promise<CreateCommentResponse>;
  onSuccess: (
    data: CreateCommentResponse,
    variables: { postId: number; payload: CreateCommentRequest },
    context: unknown,
  ) => Promise<void>;
  onError: (
    error: Error,
    variables: { postId: number; payload: CreateCommentRequest },
    context: unknown,
  ) => void;
}

describe("useCreateCommentMutation", () => {
  const mockInvalidateQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    } as never);

    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn() } as never);
  });

  it("mutationFn 실행 시 createComment API를 호출한다", async () => {
    renderHook(() => useCreateCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockParams = { postId: 123, payload: { content: "테스트 댓글" } };

    await options.mutationFn(mockParams);

    expect(createComment).toHaveBeenCalledTimes(1);
    expect(createComment).toHaveBeenCalledWith(123, { content: "테스트 댓글" });
  });

  it("onSuccess 시 성공 토스트를 띄우고 관련 쿼리를 무효화한다", async () => {
    renderHook(() => useCreateCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockResponse = 999;
    const mockVariables = { postId: 123, payload: { content: "테스트 댓글" } };

    await options.onSuccess(mockResponse, mockVariables, undefined);

    expect(toast.success).toHaveBeenCalledWith("댓글이 작성되었습니다.");
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.comment.byPost(123),
    });
  });

  it("onError 시 에러 토스트를 띄운다", () => {
    renderHook(() => useCreateCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockVariables = { postId: 123, payload: { content: "테스트 댓글" } };

    options.onError(new Error("Test Error"), mockVariables, undefined);

    expect(toast.error).toHaveBeenCalledWith(
      "댓글 작성 중 오류가 발생했습니다.",
    );
  });
});

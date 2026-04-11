import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { toast } from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDeleteCommentMutation } from "./useDeleteCommentMutation";

import { deleteComment } from "@/entities/comment/api/deleteComment";
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

vi.mock("@/entities/comment/api/deleteComment", () => ({
  deleteComment: vi.fn(),
}));

interface MockMutationOptions {
  mutationFn: (variables: {
    commentId: number;
    postId: number;
  }) => Promise<void>;
  onSuccess: (
    data: void,
    variables: { commentId: number; postId: number },
    context: unknown,
  ) => Promise<void>;
  onError: (
    error: Error,
    variables: { commentId: number; postId: number },
    context: unknown,
  ) => void;
}

describe("useDeleteCommentMutation", () => {
  const mockInvalidateQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    } as never);

    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn() } as never);
  });

  it("mutationFn 실행 시 deleteComment API를 호출한다", async () => {
    renderHook(() => useDeleteCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockParams = { commentId: 456, postId: 123 };

    await options.mutationFn(mockParams);

    expect(deleteComment).toHaveBeenCalledTimes(1);
    expect(deleteComment).toHaveBeenCalledWith(456);
  });

  it("onSuccess 시 성공 토스트를 띄우고 관련 쿼리를 무효화한다", async () => {
    renderHook(() => useDeleteCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockVariables = { commentId: 456, postId: 123 };

    await options.onSuccess(undefined, mockVariables, undefined);

    expect(toast.success).toHaveBeenCalledWith("댓글이 삭제되었습니다.");
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.comment.byPost(123),
    });
  });

  it("onError 시 에러 토스트를 띄운다", () => {
    renderHook(() => useDeleteCommentMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockVariables = { commentId: 456, postId: 123 };

    options.onError(new Error("Test Error"), mockVariables, undefined);

    expect(toast.error).toHaveBeenCalledWith(
      "댓글 삭제 중 오류가 발생했습니다.",
    );
  });
});

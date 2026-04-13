import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDeletePostMutation } from "./useDeletePostMutation";

import { deletePost } from "@/entities/post/api/deletePost";
import { queryKeys } from "@/shared/api/query-keys";

const { mockInvalidateQueries, mockRemoveQueries } = vi.hoisted(() => ({
  mockInvalidateQueries: vi.fn(),
  mockRemoveQueries: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/entities/post/api/deletePost", () => ({
  deletePost: vi.fn(),
}));

interface DeletePostMutationOptions {
  mutationFn: (postId: number) => Promise<unknown>;
  onSuccess?: (
    data: unknown,
    postId: number,
    ...rest: unknown[]
  ) => Promise<unknown> | unknown;
}

describe("useDeletePostMutation", () => {
interface MockMutationOptions {
  mutationFn: (postId: number) => Promise<void>;
  onSuccess: (data: void, postId: number, context: unknown) => Promise<void>;
}

describe("useDeletePostMutation", () => {
  const mockInvalidateQueries = vi.fn();
  const mockRemoveQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
      removeQueries: mockRemoveQueries,
    } as never);

    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn() } as never);
  });

  it("mutationFn 실행 시 postId를 deletePost에 전달한다", async () => {
    renderHook(() => useDeletePostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as DeletePostMutationOptions;
    await (options.mutationFn as (postId: number) => Promise<unknown>)(321);

    expect(deletePost).toHaveBeenCalledWith(321);
  });

  it("삭제 성공 시 post 캐시를 invalidate/remove 한다", async () => {
    renderHook(() => useDeletePostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as DeletePostMutationOptions;
    await options.onSuccess?.(undefined, 321);

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.post.all,
    });
    expect(mockRemoveQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.post.detail(321),
  it("mutationFn 실행 시 deletePost API를 호출한다", async () => {
    renderHook(() => useDeletePostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;

    await options.mutationFn(777);

    expect(deletePost).toHaveBeenCalledTimes(1);
    expect(deletePost).toHaveBeenCalledWith(777);
  });

  it("onSuccess 시 post.all 쿼리를 무효화하고 post.detail 쿼리를 제거한다", async () => {
    renderHook(() => useDeletePostMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;

    await options.onSuccess(undefined, 777, undefined);

    expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.post.all,
    });

    expect(mockRemoveQueries).toHaveBeenCalledTimes(1);
    expect(mockRemoveQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.post.detail(777),
    });
  });
});

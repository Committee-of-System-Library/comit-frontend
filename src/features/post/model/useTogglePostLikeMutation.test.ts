import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { applyOptimisticPostLikeUpdate } from "./postLikeCache";
import { useTogglePostLikeMutation } from "./useTogglePostLikeMutation";

import { togglePostLike } from "@/entities/post/api/togglePostLike";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("@/entities/post/api/togglePostLike", () => ({
  togglePostLike: vi.fn(),
}));

vi.mock("./postLikeCache", () => ({
  applyOptimisticPostLikeUpdate: vi.fn(),
}));

interface MockMutationOptions {
  mutationFn: (postId: number) => Promise<void>;
  onMutate: (postId: number) => Promise<{
    snapshots: (readonly [QueryKey, unknown])[];
  }>;
  onError: (
    error: Error,
    postId: number,
    context?: { snapshots: (readonly [QueryKey, unknown])[] },
  ) => void;
}

describe("useTogglePostLikeMutation", () => {
  const mockCancelQueries = vi.fn();
  const mockGetQueryData = vi.fn();
  const mockGetQueriesData = vi.fn();
  const mockSetQueriesData = vi.fn();
  const mockSetQueryData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQueryClient).mockReturnValue({
      cancelQueries: mockCancelQueries,
      getQueryData: mockGetQueryData,
      getQueriesData: mockGetQueriesData,
      setQueriesData: mockSetQueriesData,
      setQueryData: mockSetQueryData,
    } as never);

    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn() } as never);
  });

  it("mutationFn 실행 시 togglePostLike API를 호출한다", async () => {
    renderHook(() => useTogglePostLikeMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;

    await options.mutationFn(100);

    expect(togglePostLike).toHaveBeenCalledTimes(1);
    expect(togglePostLike).toHaveBeenCalledWith(100);
  });

  it("onMutate 실행 시 이전 게시글이 존재하면 낙관적 업데이트를 수행하고 snapshots를 반환한다", async () => {
    renderHook(() => useTogglePostLikeMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockSnapshots: (readonly [QueryKey, unknown])[] = [
      [queryKeys.post.all, { fakeData: true }],
    ];

    mockGetQueryData.mockReturnValue({ likedByMe: false });
    mockGetQueriesData.mockReturnValue(mockSnapshots);

    const context = await options.onMutate(100);

    expect(mockCancelQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.post.all,
    });
    expect(mockGetQueryData).toHaveBeenCalledWith(queryKeys.post.detail(100));
    expect(mockGetQueriesData).toHaveBeenCalledWith({
      queryKey: queryKeys.post.all,
    });
    expect(mockSetQueriesData).toHaveBeenCalledWith(
      { queryKey: queryKeys.post.all },
      expect.any(Function),
    );

    const updaterFn = mockSetQueriesData.mock.calls[0][1];
    updaterFn("current-cache-data");

    expect(applyOptimisticPostLikeUpdate).toHaveBeenCalledWith(
      "current-cache-data",
      100,
      true,
    );

    expect(context).toEqual({ snapshots: mockSnapshots });
  });

  it("onMutate 실행 시 이전 게시글이 존재하지 않으면 빈 snapshots를 반환한다", async () => {
    renderHook(() => useTogglePostLikeMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;

    mockGetQueryData.mockReturnValue(null);

    const context = await options.onMutate(100);

    expect(mockCancelQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.post.all,
    });
    expect(mockGetQueryData).toHaveBeenCalledWith(queryKeys.post.detail(100));
    expect(mockGetQueriesData).not.toHaveBeenCalled();
    expect(mockSetQueriesData).not.toHaveBeenCalled();

    expect(context).toEqual({ snapshots: [] });
  });

  it("onError 실행 시 context에 snapshots가 존재하면 이전 캐시로 롤백한다", () => {
    renderHook(() => useTogglePostLikeMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;
    const mockSnapshots: (readonly [QueryKey, unknown])[] = [
      [["post", "all"], { oldCache1: true }],
      [["post", "detail", 100], { oldCache2: true }],
    ];

    options.onError(new Error("Test Error"), 100, { snapshots: mockSnapshots });

    expect(mockSetQueryData).toHaveBeenCalledTimes(2);
    expect(mockSetQueryData).toHaveBeenNthCalledWith(1, ["post", "all"], {
      oldCache1: true,
    });
    expect(mockSetQueryData).toHaveBeenNthCalledWith(
      2,
      ["post", "detail", 100],
      { oldCache2: true },
    );
  });

  it("onError 실행 시 context에 snapshots가 없으면 롤백을 수행하지 않는다", () => {
    renderHook(() => useTogglePostLikeMutation());

    const options = vi.mocked(useMutation).mock
      .calls[0][0] as unknown as MockMutationOptions;

    options.onError(new Error("Test Error"), 100, { snapshots: [] });
    options.onError(new Error("Test Error"), 100, undefined);

    expect(mockSetQueryData).not.toHaveBeenCalled();
  });
});

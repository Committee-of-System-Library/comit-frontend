import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCommentsQuery } from "./useCommentsQuery";

import { getComments } from "@/entities/comment/api/getComments";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/comment/api/getComments", () => ({
  getComments: vi.fn(),
}));

describe("useCommentsQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);
  });

  it("올바른 queryKey와 기본 enabled 옵션으로 useQuery를 호출한다", () => {
    const mockPostId = 123;

    renderHook(() => useCommentsQuery({ postId: mockPostId }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.comment.byPost(mockPostId),
        enabled: true,
      }),
    );
  });

  it("queryFn 실행 시 getComments API를 호출한다", async () => {
    const mockPostId = 123;
    renderHook(() => useCommentsQuery({ postId: mockPostId }));

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(getComments).toHaveBeenCalledTimes(1);
    expect(getComments).toHaveBeenCalledWith(mockPostId);
  });

  it("enabled 옵션을 false로 전달하면 useQuery의 enabled도 false가 된다", () => {
    const mockPostId = 456;

    renderHook(() => useCommentsQuery({ postId: mockPostId, enabled: false }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });

  it("postId가 0(falsy)이면 enabled가 false가 된다", () => {
    const mockPostId = 0;

    renderHook(() => useCommentsQuery({ postId: mockPostId }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });
});

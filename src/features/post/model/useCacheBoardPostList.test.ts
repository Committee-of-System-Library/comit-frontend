import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCachedBoardPostList } from "./useCachedBoardPostList";

import { getPosts } from "@/entities/post/api/getPosts";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/post/api/getPosts", () => ({
  getPosts: vi.fn(),
}));

describe("useCachedBoardPostList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);
  });

  it("올바른 queryKey와 캐시 설정으로 useQuery를 호출한다", () => {
    renderHook(() => useCachedBoardPostList({ boardType: "FREE" }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.post.list({
          boardType: "FREE",
          cursor: undefined,
          size: 20,
        }),
        enabled: false,
        gcTime: Infinity,
        staleTime: Infinity,
      }),
    );
  });

  it("queryFn 실행 시 getPosts API를 호출한다", async () => {
    renderHook(() =>
      useCachedBoardPostList({ boardType: "INFO", cursor: 5, size: 10 }),
    );

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(getPosts).toHaveBeenCalledTimes(1);
    expect(getPosts).toHaveBeenCalledWith({
      boardType: "INFO",
      cursor: 5,
      size: 10,
    });
  });
});

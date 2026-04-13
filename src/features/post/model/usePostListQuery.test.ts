import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePostListQuery } from "./usePostListQuery";

import { getPosts } from "@/entities/post/api/getPosts";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/post/api/getPosts", () => ({
  getPosts: vi.fn(),
}));

describe("usePostListQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);
  });

  it("올바른 queryKey와 기본 설정으로 useQuery를 호출한다", () => {
    renderHook(() => usePostListQuery({ boardType: "FREE" }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.post.list({
          boardType: "FREE",
          cursor: undefined,
          size: 20,
        }),
        enabled: true,
      }),
    );
  });

  it("queryFn 실행 시 getPosts API를 호출한다", async () => {
    renderHook(() =>
      usePostListQuery({ boardType: "INFO", cursor: 10, size: 15 }),
    );

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(getPosts).toHaveBeenCalledTimes(1);
    expect(getPosts).toHaveBeenCalledWith({
      boardType: "INFO",
      cursor: 10,
      size: 15,
    });
  });

  it("enabled 옵션을 false로 전달하면 useQuery의 enabled도 false가 된다", () => {
    renderHook(() => usePostListQuery({ boardType: "NOTICE", enabled: false }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });
});

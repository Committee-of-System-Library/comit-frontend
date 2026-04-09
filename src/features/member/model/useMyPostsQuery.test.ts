import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMyPostsQuery } from "./useMyPostsQuery";

import { getMyPosts } from "@/entities/member/api/getMyPosts";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/member/api/getMyPosts", () => ({
  getMyPosts: vi.fn(),
}));

describe("useMyPostsQuery", () => {
  it("올바른 queryKey로 useQuery를 호출한다", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyPostsQuery());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.member.myPosts(),
      }),
    );
  });

  it("queryFn 실행 시 getMyPosts를 호출한다", async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyPostsQuery());

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(getMyPosts).toHaveBeenCalled();
  });
});

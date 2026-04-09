import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMyLikesQuery } from "./useMyLikesQuery";

import { getMyLikes } from "@/entities/member/api/getMyLikes";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/member/api/getMyLikes", () => ({
  getMyLikes: vi.fn(),
}));

describe("useMyLikesQuery", () => {
  it("올바른 queryKey로 useQuery를 호출한다", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyLikesQuery());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.member.myLikes(),
      }),
    );
  });

  it("queryFn 실행 시 getMyLikes를 호출한다", async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyLikesQuery());

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(getMyLikes).toHaveBeenCalled();
  });
});

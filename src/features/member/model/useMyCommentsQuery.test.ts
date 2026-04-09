import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMyCommentsQuery } from "./useMyCommentsQuery";

import { getMyComments } from "@/entities/member/api/getMyComments";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/member/api/getMyComments", () => ({
  getMyComments: vi.fn(),
}));

describe("useMyCommentsQuery", () => {
  it("올바른 queryKey로 useQuery를 호출한다", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyCommentsQuery());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.member.myComments(),
      }),
    );
  });

  it("queryFn 실행 시 getMyComments를 호출한다", async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyCommentsQuery());

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(getMyComments).toHaveBeenCalled();
  });
});

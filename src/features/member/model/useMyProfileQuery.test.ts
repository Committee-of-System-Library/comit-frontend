import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMyProfileQuery } from "./useMyProfileQuery";

import { getMyProfile } from "@/entities/member/api/getMyProfile";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/member/api/getMyProfile", () => ({
  getMyProfile: vi.fn(),
}));

describe("useMyProfileQuery", () => {
  it("올바른 queryKey로 useQuery를 호출한다", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyProfileQuery());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.member.me(),
      }),
    );
  });

  it("queryFn 실행 시 getMyProfile을 호출한다", async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyProfileQuery());

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(getMyProfile).toHaveBeenCalled();
  });

  it("enabled 옵션이 false일 때 반영된다", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyProfileQuery({ enabled: false }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });
});

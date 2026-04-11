import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMyProfileQuery } from "./useMyProfileQuery";

import { getMyProfile } from "@/entities/member/api/getMyProfile";
import { ApiHttpError } from "@/shared/api/http-error";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/member/api/getMyProfile", () => ({
  getMyProfile: vi.fn(),
}));

describe("useMyProfileQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("올바른 queryKey와 queryFn으로 useQuery를 호출한다", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyProfileQuery());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.member.me(),
        queryFn: expect.any(Function),
      }),
    );
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

  it("401/403 에러는 null로 정규화한다", async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyProfileQuery());

    const queryOptions = vi.mocked(useQuery).mock.calls[0]?.[0] as {
      queryFn: () => Promise<unknown>;
    };

    vi.mocked(getMyProfile).mockRejectedValueOnce(
      new ApiHttpError({
        message: "Unauthorized",
        method: "GET",
        status: 401,
        url: "/members/me",
      }),
    );

    await expect(queryOptions.queryFn()).resolves.toBeNull();
  });

  it("401/403 이외 에러는 그대로 throw한다", async () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);

    renderHook(() => useMyProfileQuery());

    const queryOptions = vi.mocked(useQuery).mock.calls[0]?.[0] as {
      queryFn: () => Promise<unknown>;
    };

    const internalServerError = new ApiHttpError({
      message: "Internal Server Error",
      method: "GET",
      status: 500,
      url: "/members/me",
    });

    vi.mocked(getMyProfile).mockRejectedValueOnce(internalServerError);

    await expect(queryOptions.queryFn()).rejects.toBe(internalServerError);
  });
});

import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePostDetailQuery } from "./usePostDetailQuery";

import { getPostDetail } from "@/entities/post/api/getPostDetail";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/post/api/getPostDetail", () => ({
  getPostDetail: vi.fn(),
}));

describe("usePostDetailQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);
  });

  it("올바른 queryKey와 기본 설정으로 useQuery를 호출한다", () => {
    renderHook(() => usePostDetailQuery({ postId: 10 }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.post.detail(10),
        enabled: true,
      }),
    );
  });

  it("queryFn 실행 시 getPostDetail API를 호출한다", async () => {
    renderHook(() => usePostDetailQuery({ postId: 10 }));

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(getPostDetail).toHaveBeenCalledTimes(1);
    expect(getPostDetail).toHaveBeenCalledWith(10);
  });

  it("enabled 옵션을 false로 전달하면 useQuery의 enabled도 false가 된다", () => {
    renderHook(() => usePostDetailQuery({ postId: 10, enabled: false }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });

  it("postId가 0 이하이면 enabled가 false가 된다", () => {
    renderHook(() => usePostDetailQuery({ postId: 0 }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });
});

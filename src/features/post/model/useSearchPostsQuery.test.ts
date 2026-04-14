import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearchPostsQuery } from "./useSearchPostsQuery";

import { searchPosts } from "@/entities/post/api/searchPosts";
import { queryKeys } from "@/shared/api/query-keys";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/entities/post/api/searchPosts", () => ({
  searchPosts: vi.fn(),
}));

describe("useSearchPostsQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQuery).mockReturnValue({ data: undefined } as never);
  });

  it("올바른 queryKey로 useQuery를 호출한다", () => {
    renderHook(() => useSearchPostsQuery({ keyword: "React" }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: queryKeys.post.search("React", undefined),
      }),
    );
  });

  it("keyword가 있을 때 enabled가 true이다", () => {
    renderHook(() => useSearchPostsQuery({ keyword: "React" }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    );
  });

  it("keyword가 빈 문자열이면 enabled가 false이다", () => {
    renderHook(() => useSearchPostsQuery({ keyword: "" }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });

  it("keyword가 공백만 있으면 enabled가 false이다", () => {
    renderHook(() => useSearchPostsQuery({ keyword: "   " }));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      }),
    );
  });

  it("queryFn 실행 시 searchPosts를 keyword trim 후 호출한다", async () => {
    renderHook(() =>
      useSearchPostsQuery({ keyword: "  React  ", cursor: 5, size: 10 }),
    );

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(searchPosts).toHaveBeenCalledTimes(1);
    expect(searchPosts).toHaveBeenCalledWith({
      keyword: "React",
      boardType: undefined,
      cursor: 5,
      size: 10,
    });
  });

  it("boardType이 주어지면 searchPosts에 전달한다", async () => {
    renderHook(() =>
      useSearchPostsQuery({ keyword: "TypeScript", boardType: "QNA" }),
    );

    const options = vi.mocked(useQuery).mock.calls[0][0];
    await (options.queryFn as () => Promise<unknown>)?.();

    expect(searchPosts).toHaveBeenCalledWith(
      expect.objectContaining({
        boardType: "QNA",
      }),
    );
  });
});
